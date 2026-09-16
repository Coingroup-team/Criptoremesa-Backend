import passport from "passport";
import PassportLocal from "passport-local";
import { logger } from "./logger";
import ObjLog from "./ObjLog";
import authenticationPGRepository from "../modules/authentication/repositories/authentication.pg.repository";
import bcrypt from "bcryptjs";
import { notifyChanges } from "../modules/sockets/sockets.coordinator";
import fs from 'fs';

const LocalStrategy = PassportLocal.Strategy;
const context = "Authentication module";

// Estado del login POR PETICION. Antes vivia en variables globales del modulo
// (user, globalUser, blockedOrNotVerified, expressObj) compartidas entre todas
// las peticiones concurrentes: un intento con un email inexistente le sumaba el
// fallo al ultimo usuario real que habia pasado por el login, y una respuesta
// podia salir por el res de otra peticion.
function getLoginCtx(req) {
  if (!req.loginCtx) {
    req.loginCtx = {
      req,
      res: null,
      next: null,
      isAuthenticated: false,
      userExists: false,
      userActiveSession: false,
      blockedOrNotVerified: false,
      foundUser: null,
    };
  }
  return req.loginCtx;
}

// THIS SENDS A CUSTOM RESPONSE IF USER LOGS IN CORRECTLY
async function resp(ctx, user) {
  try {
    if (user.expired) {
      ctx.res.status(401).send({
        message:
          "There is already an active session with this user. Try again in a few minutes.",
      });
    } else if (
      user.user_blocked ||
      (user.id_verif_level === 0 && !user.verif_level_apb)
    ) {
      let response;
      if (user) {
        response = await authenticationPGRepository.loginFailed(
          user.email_user
        );
      }

      ctx.res.status(400).send({
        user_blocked: user.user_blocked,
        id_verif_level: user.id_verif_level,
        verif_level_apb: user.verif_level_apb,
        atcPhone: response ? response.atcPhone : "NA",
      });
    } else {
      // No se envian los hashes de contrasena al cliente
      const safeUser = Object.assign({}, user);
      delete safeUser.password;
      delete safeUser.ops_password;

      ctx.res.status(200).send({
        isAuthenticated: ctx.isAuthenticated,
        user: safeUser,
        captchaSuccess: true,
      });
    }
    ctx.next();
  } catch (error) {
    ctx.next(error);
  }
}

//PASSPORT AUTHENTICATION

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const ctx = getLoginCtx(req);
        ctx.isAuthenticated = false;
        ctx.userExists = false;
        ctx.userActiveSession = false;
        ctx.blockedOrNotVerified = false;
        ctx.foundUser = null;

        logger.info(`[${context}]: Checking user`);

        const user = await authenticationPGRepository.getUserByEmail(email.toLowerCase());

        if (user && user.wholesale_partner_info) {
          user.wholesale_partner_info.logo = fs.readFileSync(
            user.wholesale_partner_info.logo
          );
        }

        if (user) {
          logger.info(`[${context}]: User found, checking password`);

          if (
            user.user_blocked ||
            (user.id_verif_level === 0 && !user.verif_level_apb)
          ) {
            logger.error(`[${context}]: User is blocked or not verified`);

            ctx.blockedOrNotVerified = true;

            await resp(ctx, user);

            done(null, false);
          } else {
            ctx.userExists = true;
            ctx.foundUser = user;

            let match = await bcrypt.compare(password, user.password);

            if (match) {
              logger.info(`[${context}]: Successful login`);

              ctx.userActiveSession =
                await authenticationPGRepository.userHasAnActiveSession(email);

              if (ctx.userActiveSession) {
                req.session = null;

                user.expired = true;

                notifyChanges("login_attempt", {
                  email_user: email,
                });

                await resp(ctx, user);

                return done(null, false);
              } else {
                ctx.isAuthenticated = true;

                await resp(ctx, user);

                return done(null, user);
              }
            }
            logger.error(`[${context}]: User and password do not match`);
            ObjLog.log(`[${context}]: User and password do not match`);

            return done(null, false);
          }
        } else {
          logger.error(`[${context}]: User and password do not match`);
          ObjLog.log(`[${context}]: User and password do not match`);

          return done(null, false);
        }
      } catch (error) {
        throw error;
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  // PASSPORT LOOKS FOR THE ID AND STORE IT IN SESSION
  if (user) done(null, user.email_user);
});

passport.deserializeUser(async function (email_user, done) {
  try {
    // PASSPORT LOOKS FOR THE USER OBJECT WITH THE PREVIOUS email_user
    const user = await authenticationPGRepository.getUserByEmail(email_user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default {
  verify: async (req, res, next) => {
    try {
      const ctx = getLoginCtx(req);
      ctx.res = res;
      ctx.next = next;

      passport.authenticate("local", async (err, user, info) => {
        if (err) {
          return next(err);
        }
        let response = null;
        if (
          !ctx.blockedOrNotVerified &&
          !ctx.isAuthenticated &&
          !ctx.userActiveSession
        ) {
          // Solo se cuenta el fallo al usuario encontrado EN ESTA peticion
          if (ctx.foundUser) {
            response = await authenticationPGRepository.loginFailed(
              ctx.foundUser.email_user
            );
          }

          res.json({
            isAuthenticated: false,
            loginAttempts: response ? response.login_attempts : "NA",
            atcPhone: response ? response.atcPhone : "NA",
            userExists: ctx.userExists,
            captchaSuccess: true,
          });
          next();
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
          });
        }
        next();
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      req.session.destroy();
      await authenticationPGRepository.userHasAnActiveSession(req.params.email_user);

      res.status(200).json({ message: "Logged out succesfully" });
      next();
    } catch (error) {
      next(error);
    }
  },
};
