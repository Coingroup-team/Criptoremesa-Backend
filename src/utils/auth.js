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
let user;
let globalUser;
let blockedOrNotVerified = false;

const expressObj = {
  req: null,
  res: null,
  next: null,
  isAuthenticated: false,
  userExists: false,
  userActiveSession: false,
};

// declaring log object
const logConst = {
  is_auth: null,
  success: true,
  failed: false,
  ip: null,
  country: null,
  route: null,
  session: null,
};

let log = logConst;

// THIS SENDS A CUSTOM RESPONSE IF USER LOGS IN CORRECTLY
async function resp(user) {
  try {
    let countryResp = null;
    let sess = null;

    const resp = null /*await authenticationPGRepository.getIpInfo(
      expressObj.req.header("Client-Ip")
    );*/
    if (resp) countryResp = resp.country_name;

    if (
      await authenticationPGRepository.getSessionById(expressObj.req.sessionID)
    )
      sess = expressObj.req.sessionID;

    if (user.expired) {
      log.success = false;
      log.failed = true;
      log.status = 401;
      log.response = {
                        message: 
                        "There is already an active session with this user. Try again in a few minutes.",
                      };
      await authenticationPGRepository.insertLogMsg(log);

      expressObj.res.status(401).send({
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
      log.success = false;
      log.failed = true;
      log.status = 400;
      log.response = {
                        user_blocked: user.user_blocked,
                        id_verif_level: user.id_verif_level,
                        verif_level_apb: user.verif_level_apb,
                        atcPhone: response ? response.atcPhone : "NA",
                      };
      await authenticationPGRepository.insertLogMsg(log);

      expressObj.res.status(400).send({
        user_blocked: user.user_blocked,
        id_verif_level: user.id_verif_level,
        verif_level_apb: user.verif_level_apb,
        atcPhone: response ? response.atcPhone : "NA",
      });
    } else {
      log.success = true;
      log.failed = false;
      log.status = 200;
      log.response = {
                        isAuthenticated: expressObj.isAuthenticated,
                        user,
                        captchaSuccess: true,
                      };
      await authenticationPGRepository.insertLogMsg(log);

      expressObj.res.status(200).send({
        isAuthenticated: expressObj.isAuthenticated,
        user,
        captchaSuccess: true,
      });
    }
    expressObj.next();
  } catch (error) {
    expressObj.next(error);
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
        // UPDATE IP IN BD
        let countryResp = null;
        let sess = null;
        expressObj.isAuthenticated = false;
        expressObj.userExists = false;
        blockedOrNotVerified = false;

        /* Comento actualizacion de IP
        await authenticationPGRepository.updateIPSession(
          req.sessionID,
          req.header("Client-Ip")
        );
        */

        logger.info(`[${context}]: Checking user`);
        ObjLog.log(`[${context}]: Checking user`);

        // if (guard.getUsernameField() === "email")
        user = await authenticationPGRepository.getUserByEmail(email.toLowerCase());

        console.log('USER OBTENIDO🔴:',user)

        if (user && user.wholesale_partner_info) {
          user.wholesale_partner_info.logo = fs.readFileSync(
            user.wholesale_partner_info.logo
          );
          // console.log('USER QUE SE MANDA EN EL LOGIN: ',user)
        }

        // else
        //   user = await authenticationPGRepository.getUserByUsername(username);

        if (user) {
          logger.info(`[${context}]: User found, checking password`);
          ObjLog.log(`[${context}]: User found, checking password`);

          if (
            user.user_blocked ||
            (user.id_verif_level === 0 && !user.verif_level_apb)
          ) {
            logger.error(`[${context}]: User is blocked or not verified`);
            ObjLog.log(`[${context}]: User is blocked or not verified`);

            blockedOrNotVerified = true;

            if (await authenticationPGRepository.getSessionById(req.sessionID))
              sess = req.sessionID;

            await resp(user);

            done(null, false);
            expressObj.req = req;
          } else {
            expressObj.userExists = true;
            globalUser = user;

            /*
            await authenticationPGRepository.updateIPUser(
              user.id_uuid,
              req.header("Client-Ip"),
              req.sessionID
            );
            */

            let match = await bcrypt.compare(password, user.password);

            if (match) {
              logger.info(`[${context}]: Successful login`);
              ObjLog.log(`[${context}]: Successful login`);

              expressObj.userActiveSession =
                await authenticationPGRepository.userHasAnActiveSession(email);

              if (expressObj.userActiveSession) {
                req.session = null;

                user.expired = true;

                notifyChanges("login_attempt", {
                  email_user: email,
                });

                await resp(user);

                return done(null, false);
              } else {
                expressObj.isAuthenticated = true;

                await resp(user);

                return done(null, user);
              }
            }
            logger.error(`[${context}]: User and password do not match`);
            ObjLog.log(`[${context}]: User and password do not match`);
            if (await authenticationPGRepository.getSessionById(req.sessionID))
              sess = req.sessionID;

            return done(null, false);
          }
        } else {
          logger.error(`[${context}]: User and password do not match`);
          ObjLog.log(`[${context}]: User and password do not match`);

          if (await authenticationPGRepository.getSessionById(req.sessionID))
            sess = req.sessionID;

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
  // console.log('SERIALIZE🔵')
  if (user) done(null, user.email_user);
});

passport.deserializeUser(async function (email_user, done) {
  try {
    // PASSPORT LOOKS FOR THE USER OBJECT WITH THE PREVIOUS email_user
    // console.log('DESERIALIZE🟠')

    const user = await authenticationPGRepository.getUserByEmail(email_user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default {
  verify: async (req, res, next) => {
    try {
      expressObj.req = req;
      expressObj.res = res;
      expressObj.next = next;

      // filling log object info
      log.is_auth = req.isAuthenticated();
      log.ip = req.header("Client-Ip");
      log.route = req.method + " " + req.originalUrl;
      const resp = {};/*await authenticationPGRepository.getIpInfo(
        req.header("Client-Ip")
      );*/
      if (resp)
        log.country = resp.country_name
          ? resp.country_name
          : "Probably Localhost";
      if (await authenticationPGRepository.getSessionById(req.sessionID)) // si cambiamos de postgres a redis lo de las sesiones, esto se puede optimizar
        log.session = req.sessionID;

      log.params = req.params;
      log.query = req.query;
      log.body = req.body;

      passport.authenticate("local", async (err, user, info) => {
        if (err) {
          return expressObj.next(err);
        }
        let response = null;
        if (
          !blockedOrNotVerified &&
          !expressObj.isAuthenticated &&
          !expressObj.userActiveSession
        ) {
          if (globalUser) {
            response = await authenticationPGRepository.loginFailed(
              globalUser.email_user
            );
          }
          log.success = true;
          log.failed = false;
          log.status = 200;
          log.response = {
                          isAuthenticated: false,
                          loginAttempts: response ? response.login_attempts : "NA",
                          atcPhone: response ? response.atcPhone : "NA",
                          userExists: expressObj.userExists,
                          captchaSuccess: true,
                        };
          //await authenticationPGRepository.insertLogMsg(log); Comentado para optimizar

          res.json({
            isAuthenticated: false,
            loginAttempts: response ? response.login_attempts : "NA",
            atcPhone: response ? response.atcPhone : "NA",
            userExists: expressObj.userExists,
            captchaSuccess: true,
          });
          expressObj.next();
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
          });
        }
        expressObj.next();
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
        });
        console.log('req.sessionID: ',req.sessionID)
      })(req, res, next);
    } catch (error) {
      expressObj.next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      console.log('req.isAuthenticated(): ',req.isAuthenticated())
      console.log('req.sessionID: ',req.sessionID)
      console.log('req.session.destroy(): ',req.session)

      log.is_auth = req.isAuthenticated();
      req.session.destroy();
      await authenticationPGRepository.userHasAnActiveSession(req.params.email_user);
      log.success = true;
      log.failed = false;
      log.status = 200;
      log.response = { message: "Logged out succesfully" };
      await authenticationPGRepository.insertLogMsg(log);

      res.status(200).json({ message: "Logged out succesfully" });
      next();
    } catch (error) {
      next(error);
    }
  },
};
