import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import usersPGRepository from "../repositories/users.pg.repository";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import bcrypt from "bcryptjs";
import formidable from "formidable";
import fs from "fs";
import { env } from "../../../utils/enviroment";
import mailSender from "../../../utils/mail";
import { join, resolve } from "path";
import axios from "axios";

const client = require("twilio")(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const usersService = {};
const context = "users Service";
let events = {};

function between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function sendSMS(to, body) {
  try {
    client.messages
      .create({
        body,
        from: "+17653024583",
        to,
      })
      .then((message) => {
        return message;
      })
      .catch((err) => {
        next(error);
      });
    // const params = new url.URLSearchParams({
    //   To: to,
    //   From: '+17653024583',
    //   Body: body
    //  });
    // let message = await axios.post(
    //   `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    //   params.toString(),
    //   {
    //     auth: {
    //       username: env.TWILIO_ACCOUNT_SID,
    //       password: env.TWILIO_AUTH_TOKEN
    //     }
    //   }
    //   );
    // return message.data
  } catch (error) {
    next(error);
  }
}

usersService.createNewClient = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Creating new Client`);
    ObjLog.log(`[${context}]: Creating new Client`);
    if (!req.body.captcha) {
      res.status(400).json({
        captchaSuccess: false,
        msg: "Ha ocurrido un error. Por favor completa el captcha",
      });
    } else {
      // Secret key
      const secretKey = env.reCAPTCHA_SECRET_KEY;

      // Verify URL
      const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${
        req.body.captcha
      }&remoteip=${req.header("Client-Ip")}`;

      // Make a request to verifyURL
      const body = await axios.get(verifyURL);

      // // If not successful
      if (body.data.success === false) {
        res.status(500).json({
          captchaSuccess: false,
          msg: "Falló la verificación del Captcha",
        });
      } else {
        // If successful

        let password = await bcrypt.hash(req.body.password, 10);
        let userObj = req.body;

        userObj.password = password;
        userObj.last_ip_registred = req.header("Client-Ip");

        const response = await usersPGRepository.createNewClient(userObj);

        return {
          data: {
            msg: "User registred succesfully",
            user: response,
            captchaSuccess: true,
          },
          status: 200,
          success: true,
          failed: false,
        };
      }
    }
  } catch (error) {
    if (error.code === "23505") {
      next({
        message: "Email already exists",
      });
    } else next(error);
  }
};

usersService.approveLevelCero = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Approving level Zero`);
    ObjLog.log(`[${context}]: Approving level Zero`);

    await usersPGRepository.approveLevelCero(req.params.id);

    return {
      data: { message: "User level cero approved succesfully" },
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.files = async (req, res, next) => {
  try {
    // await usersPGRepository.unblockEmployee(req.params.id);

    // const resp = authenticationPGRepository.getIpInfo(req.header('Client-Ip'));
    // if (resp) countryResp = resp.country_name;
    // if (await authenticationPGRepository.getSessionById(req.sessionID))
    //   sess = req.sessionID;

    // const log = {
    //   is_auth: req.isAuthenticated(),
    //   success: true,
    //   failed: false,
    //   ip: req.header('Client-Ip'),
    //   country: countryResp,
    //   route: "/users/unblockEmployee",
    //   session: sess,
    // };
    // authenticationPGRepository.insertLogMsg(log);

    let fileError = false;
    let filePath = "";
    let fileSize = "";
    let fileType = "";

    // events = [
    //   {
    //     event: "error",
    //     action: function (err) {
    //       fileError = true;
    //       console.log("err::", err);
    //       next({
    //         message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
    //       });
    //     },
    //   },
    //   {
    //     event: "fileBegin",
    //     action: function (req, res, next, name, file) {
    //       filePath = file.path;
    //       fileSize = file.size;
    //       fileType = file.type;

    //       console.log("fileError ", fileError);
    //       console.log("fileType ", fileType);

    //       if (
    //         !fileError &&
    //         (fileType === "image/png" ||
    //           fileType === "image/jpg" ||
    //           fileType === "image/jpeg" ||
    //           fileType === "image/gif" ||
    //           fileType === "application/pdf")
    //       ) {
    //         fs.rename(filePath, form.uploadDir + "/pruebaFE7", (error) => {
    //           if (error) {
    //             // Show the error
    //             next(error);
    //           } else {
    //             // List all the filenames after renaming
    //             res.status(200).json({ message: "Archivo guardado" });
    //           }
    //         });
    //       } else {
    //         console.log("filePath ", filePath);
    //         console.log("fileSize ", fileSize);
    //         console.log("fileType ", fileType);
    //         next({
    //           message: `El archivo subido no tiene un formato permitido`,
    //         });
    //       }
    //     },
    //   },
    // ];

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 2 * 1024 * 1024,
      keepExtensions: true,
    });

    form.on("error", function (err) {
      // console.log("An error has occured with form upload: ", err.message);
      fileError = true;
      console.log("err::", err);
      next({
        message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
      });
    });

    form.on("field", (name, value) => {
      console.log("field name: ", name);
      console.log("field value: ", value);
    });

    form.on("file", function (field, file) {
      //rename the incoming file to the file's name
      filePath = file.path;
      fileSize = file.size;
      fileType = file.type;
      console.log("filePath on", filePath);
      console.log("fileSize on", fileSize);
      console.log("fileType on", fileType);
    });

    // form.onPart = function (part) {
    //   // let formidable handle only non-file parts
    //   console.log("part: ", part);

    //   if (part.filename === "" || !part.mime) {
    //     // used internally, please do not override!
    //     form.handlePart(part);
    //   }
    // };
    form.parse(req, function (err, fields, files) {
      console.log("fileError ", fileError);
      console.log("fileType ", fileType);

      if (
        !fileError &&
        (fileType === "image/png" ||
          fileType === "image/jpg" ||
          fileType === "image/jpeg" ||
          fileType === "image/gif" ||
          fileType === "application/pdf")
      ) {
        fs.rename(filePath, form.uploadDir + "/pruebaFE9", (error) => {
          if (error) {
            // Show the error
            next(error);
          } else {
            // List all the filenames after renaming
            return {
              data: { message: "Archivo guardado" },
              status: 200,
              success: true,
              failed: false,
            };
          }
        });
      } else {
        console.log("filePath ", filePath);
        console.log("fileSize ", fileSize);
        console.log("fileType ", fileType);
        next({
          message: `El archivo subido no tiene un formato permitido`,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

function createFile(f, email_user, level) {
  if (
    f &&
    (f.type === "image/png" ||
      f.type === "image/jpg" ||
      f.type === "image/jpeg" ||
      f.type === "image/gif" ||
      f.type === "application/pdf")
  ) {
    let numbers = [];
    let exists = true;
    let pathName;
    while (exists) {
      let number = between(10000, 99999);
      pathName = join(
        env.FILES_DIR,
        `/level-${level}-req-${email_user}_${number}_${f.name}`
      );
      if (!fs.existsSync(pathName)) {
        exists = false;
        numbers.push(number);
        fs.rename(
          f.path,
          env.FILES_DIR +
            `/level-${level}-req-${email_user}_${number}_${f.name}`,
          (error) => {
            if (error) {
              next(error);
            }
          }
        );
      }
    }
    return pathName;
  }
  return null;
}

usersService.requestLevelOne1stQ = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting level one 1st question`);
    ObjLog.log(`[${context}]: Requesting level one 1st question`);
    let fileError = false;

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    });

    form.onPart = (part) => {
      if (
        !fileError &&
        !(
          part.mime === "image/png" ||
          part.mime === "image/jpg" ||
          part.mime === "image/jpeg" ||
          part.mime === "image/gif" ||
          part.mime === "application/pdf" ||
          part.mime === null
        )
      ) {
        fileError = true;
        form.emit("error");
      } else {
        form.handlePart(part);
      }
    };

    form.on("error", function (err) {
      if (fileError) {
        next({
          message: `Uno o varios archivos no tienen formato permitido`,
        });
      } else {
        fileError = true;

        next({
          message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
        });
      }
    });

    await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        let doc_path = createFile(files.doc, fields.email_user, "one");
        let selfie_path = createFile(files.selfie, fields.email_user, "one");

        if (!fileError) {
          await usersPGRepository.requestLevelOne1stQ({
            date_birth: fields.date_birth,
            state_name: fields.state_name,
            resid_city: fields.resid_city,
            pol_exp_per: fields.pol_exp_per,
            email_user: fields.email_user,
            id_ident_doc_type: fields.id_ident_doc_type,
            ident_doc_number: fields.ident_doc_number,
            occupation: fields.occupation,
            doc_path: doc_path,
            selfie_path: selfie_path,
            main_sn_platf: fields.main_sn_platf,
            user_main_sn_platf: fields.user_main_sn_platf,
          });

          setfinalResp({
            data: { message: "Request succesfuly uploaded." },
            status: 200,
            success: true,
            failed: false,
          });
        } else
          setfinalResp({
            data: { message: "There was an error with the file." },
            status: 500,
            success: false,
            failed: true,
          });
        resolve();
      });
    });
    return getfinalResp()
      ? getfinalResp()
      : {
          data: { message: "There was an error." },
          status: 500,
          success: false,
          failed: true,
        };
  } catch (error) {
    next(error);
  }
};

let answersToRepo = "ARRAY[";

function setAnswersToRepo(val) {
  answersToRepo = val;
}

function getAnswersToRepo() {
  return answersToRepo;
}

usersService.requestLevelOne2ndQ = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting level one 2nd question`);
    ObjLog.log(`[${context}]: Requesting level one 2nd question`);

    let fileError = false;

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    });

    form.onPart = (part) => {
      if (
        !fileError &&
        !(
          part.mime === "image/png" ||
          part.mime === "image/jpg" ||
          part.mime === "image/jpeg" ||
          part.mime === "image/gif" ||
          part.mime === "application/pdf" ||
          part.mime === null
        )
      ) {
        fileError = true;
        form.emit("error");
      } else {
        form.handlePart(part);
      }
    };

    form.on("error", function (err) {
      if (fileError) {
        next({
          message: `Uno o varios archivos no tienen formato permitido`,
        });
      } else {
        fileError = true;

        next({
          message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
        });
      }
    });

    await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        let doc_path = createFile(files.doc, fields.email_user, "one");
        let selfie_path = createFile(files.selfie, fields.email_user, "one");

        if (!fileError) {
          await usersPGRepository.requestLevelOne2ndQ({
            date_birth: fields.date_birth,
            state_name: fields.state_name,
            resid_city: fields.resid_city,
            pol_exp_per: fields.pol_exp_per,
            email_user: fields.email_user,
            id_country: fields.id_country,
            ident_doc_number: fields.ident_doc_number,
            occupation: fields.occupation,
            doc_path: doc_path,
            selfie_path: selfie_path,
            main_sn_platf: fields.main_sn_platf,
            user_main_sn_platf: fields.user_main_sn_platf,
          });

          setfinalResp({
            data: { message: "Request succesfuly uploaded." },
            status: 200,
            success: true,
            failed: false,
          });
        } else
          setfinalResp({
            data: { message: "There was an error with the file." },
            status: 500,
            success: false,
            failed: true,
          });
        resolve();
      });
    });
    return getfinalResp()
      ? getfinalResp()
      : {
          data: { message: "There was an error." },
          status: 500,
          success: false,
          failed: true,
        };
  } catch (error) {
    next(error);
  }
};

usersService.requestLevelOne3rdQ = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting level one 3er question`);
    ObjLog.log(`[${context}]: Requesting level one 3er question`);

    let fileError = false;

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    });

    form.onPart = (part) => {
      if (
        !fileError &&
        !(
          part.mime === "image/png" ||
          part.mime === "image/jpg" ||
          part.mime === "image/jpeg" ||
          part.mime === "image/gif" ||
          part.mime === "application/pdf" ||
          part.mime === null
        )
      ) {
        fileError = true;
        form.emit("error");
      } else {
        form.handlePart(part);
      }
    };

    form.on("error", function (err) {
      if (fileError) {
        next({
          message: `Uno o varios archivos no tienen formato permitido`,
        });
      } else {
        fileError = true;

        next({
          message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
        });
      }
    });

    await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        let doc_path = createFile(files.doc, fields.email_user, "one");
        let selfie_path = createFile(files.selfie, fields.email_user, "one");

        if (!fileError) {
          await usersPGRepository.requestLevelOne3rdQ({
            date_birth: fields.date_birth,
            state_name: fields.state_name,
            resid_city: fields.resid_city,
            pol_exp_per: fields.pol_exp_per,
            email_user: fields.email_user,
            id_country: fields.id_country,
            ident_doc_number: fields.ident_doc_number,
            occupation: fields.occupation,
            doc_path: doc_path,
            selfie_path: selfie_path,
            main_sn_platf: fields.main_sn_platf,
            user_main_sn_platf: fields.user_main_sn_platf,
          });

          setfinalResp({
            data: { message: "Request succesfuly uploaded." },
            status: 200,
            success: true,
            failed: false,
          });
        } else
          setfinalResp({
            data: { message: "There was an error with the file." },
            status: 500,
            success: false,
            failed: true,
          });
        resolve();
      });
    });
    return getfinalResp()
      ? getfinalResp()
      : {
          data: { message: "There was an error." },
          status: 500,
          success: false,
          failed: true,
        };
  } catch (error) {
    next(error);
  }
};

usersService.requestLevelTwo = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting level two`);
    ObjLog.log(`[${context}]: Requesting level two`);
    setAnswersToRepo("ARRAY[");

    let fileError = false;

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    });

    form.onPart = (part) => {
      if (
        !fileError &&
        !(
          part.mime === "image/png" ||
          part.mime === "image/jpg" ||
          part.mime === "image/jpeg" ||
          part.mime === "image/gif" ||
          part.mime === "application/pdf" ||
          part.mime === null
        )
      ) {
        fileError = true;
        form.emit("error");
      } else {
        form.handlePart(part);
      }
    };

    form.on("error", function (err) {
      if (fileError) {
        next({
          message: `Uno o varios archivos no tienen formato permitido`,
        });
      } else {
        fileError = true;
        next({
          message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
        });
      }
    });

    await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        let residency_proof_path = createFile(
          files.residency_proof,
          fields.email_user,
          "two"
        );

        if (!fileError) {
          JSON.parse(fields.answers).forEach((a) => {
            setAnswersToRepo(
              getAnswersToRepo() + `,\'${JSON.stringify(a)}\'::JSON`
            );
          });

          setAnswersToRepo(getAnswersToRepo() + "]::json[]");
          setAnswersToRepo(getAnswersToRepo().replace(",", ""));

          await usersPGRepository.requestLevelTwo({
            funds_source: fields.funds_source,
            residency_proof_path: residency_proof_path,
            answers: getAnswersToRepo(),
            email_user: fields.email_user,
          });

          setfinalResp({
            data: { message: "Request succesfuly uploaded." },
            status: 200,
            success: true,
            failed: false,
          });
        } else
          setfinalResp({
            data: { message: "There was an error with the file." },
            status: 500,
            success: false,
            failed: true,
          });
        resolve();
      });
    });
    return getfinalResp()
      ? getfinalResp()
      : {
          data: { message: "There was an error." },
          status: 500,
          success: false,
          failed: true,
        };
  } catch (error) {
    next(error);
  }
};

usersService.forgotPassword = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Forgot password request`);
    ObjLog.log(`[${context}]: Forgot password request`);

    let user = await usersPGRepository.getusersClientByEmail(
      `'${req.body.email_user}'`
    );

    let data = await usersPGRepository.generateCode(
      req.body.email_user,
      "email"
    );

    if (data.msg === "Code generated") {
      let atcNumber = await usersPGRepository.getATCNumberByIdCountry(
        `${user[0].id_resid_country}`
      );

      if (atcNumber.length > 1) atcNumber = atcNumber.join(" / ");
      else atcNumber = atcNumber[0];

      const mailResp = await mailSender.sendForgotPasswordMail({
        email_user: req.body.email_user,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        code: data.code,
        atcNumber,
      });

      return {
        data: {
          msg: data.msg,
          mailResp,
        },
        status: 200,
        success: true,
        failed: false,
      };
    } else if (data.msg === "The email does not exist") {
      return {
        data: { msg: data.msg },
        status: 400,
        success: false,
        failed: true,
      };
    }
  } catch (error) {
    next(error);
  }
};

let finalResp;
function setfinalResp(resp) {
  finalResp = resp;
}

function getfinalResp() {
  return finalResp;
}

let matchPass;
function setMatchPass(match) {
  matchPass = match;
}

function getMatchPass() {
  return matchPass;
}

usersService.newPassword = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Checking new password`);
    ObjLog.log(`[${context}]: Checking new password`);

    let passwordList = await usersPGRepository.getLastPasswords(
      req.body.email_user
    );
    setMatchPass(false);
    let matchLast = true;
    let match = false;

    if (req.body.last_password) {
      match = await bcrypt.compare(
        req.body.last_password,
        passwordList[passwordList.length - 1].password
      );

      if (!match) {
        matchLast = false;
        return {
          data: { msg: "Incorrect last password" },
          status: 400,
          success: false,
          failed: true,
        };
      }
    }
    if (matchLast) {
      await Promise.all(
        passwordList.map(async (p) => {
          match = false;
          match = await bcrypt.compare(req.body.new_password, p.password);

          if (match) {
            setMatchPass(true);
            setfinalResp({
              data: { msg: "The password cannot be equal to last 3" },
              status: 400,
              success: false,
              failed: true,
            });
          }
        })
      );
      if (!getMatchPass()) {
        let newPass = await bcrypt.hash(req.body.new_password, 10);

        let data = await usersPGRepository.newPassword({
          email_user: req.body.email_user,
          new_password: newPass,
        });
        setfinalResp({
          data,
          status: 200,
          success: false,
          failed: true,
        });
      }
    } else
      setfinalResp({
        data: { message: "There was an error." },
        status: 500,
        success: true,
        failed: false,
      });

    return getfinalResp();
  } catch (error) {
    next(error);
  }
};

usersService.getusersClientByEmail = async (req, res, next) => {
  try {
    let countryResp = null;
    let sess = null;

    let data = await usersPGRepository.getusersClientByEmail(req.params.id);

    const resp = authenticationPGRepository.getIpInfo(req.header("Client-Ip"));
    if (resp) countryResp = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID))
      sess = req.sessionID;

    const log = {
      is_auth: req.isAuthenticated(),
      success: true,
      failed: false,
      ip: req.header("Client-Ip"),
      country: countryResp,
      route: "/users/getClientByEmail",
      session: sess,
    };
    authenticationPGRepository.insertLogMsg(log);
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

usersService.sendVerificationCodeByEmail = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending verification code by email`);
    ObjLog.log(`[${context}]: Sending verification code by email`);

    let data = await usersPGRepository.generateCode(
      req.body.email_user,
      "email"
    );

    if (data.msg === "Code generated") {
      let atcNumber = await usersPGRepository.getATCNumberByIdCountry(
        `${req.body.id_resid_country}`
      );

      if (atcNumber.length > 1) atcNumber = atcNumber.join(" / ");
      else atcNumber = atcNumber[0];

      const mailResp = await mailSender.sendSignUpMail({
        email_user: req.body.email_user,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        code: data.code,
        atcNumber,
      });

      return {
        data: {
          msg: data.msg,
          mailResp,
        },
        status: 200,
        success: true,
        failed: false,
      };
    } else if (data.msg === "An error ocurred generating code.") {
      return {
        data: { msg: data.msg },
        status: 400,
        success: false,
        failed: true,
      };
    }
  } catch (error) {
    next(error);
  }
};

usersService.getLevelQuestions = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting level questions`);
    ObjLog.log(`[${context}]: Getting level questions`);

    let data = await usersPGRepository.getLevelQuestions();
    let answers = await usersPGRepository.getLevelAnswers();
    let respArr = [];

    data = data.map(function (q) {
      respArr = answers.filter((a) => {
        return q.id_level_question == a.id_level_question;
      });
      return {
        id_level_question: q.id_level_question,
        level: q.level,
        question_number: q.question_number,
        question: q.question,
        question_type: q.question_type,
        answers: respArr,
      };
    });
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.sendVerificationCodeBySMS = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending verification code by SMS`);
    ObjLog.log(`[${context}]: Sending verification code by SMS`);

    let data = await usersPGRepository.generateCode(
      req.body.main_phone_full,
      "sms"
    );

    if (data.msg === "Code generated") {
      if (
        sendSMS(
          req.body.main_phone_full,
          `💰<CriptoRemesa>💰 ${req.body.first_name}, tu código de verificación es ${data.code}. No lo compartas con nadie.`
        )
      )
        return {
          data: {
            msg: data.msg,
          },
          status: 200,
          success: true,
          failed: false,
        };
    } else if (data.msg === "An error ocurred generating code.") {
      return {
        data: { msg: data.msg },
        status: 400,
        success: false,
        failed: true,
      };
    }
  } catch (error) {
    next(error);
  }
};

usersService.sendSMS = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending SMS`);
    ObjLog.log(`[${context}]: Sending SMS`);
    res.status(200).json(sendSMS(req.body.phone_number, req.body.msg));
  } catch (error) {
    next(error);
  }
};

usersService.verifyIdentUser = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Verifying ident user`);
    ObjLog.log(`[${context}]: Verifying ident user`);
    let data = await usersPGRepository.verifyIdentUser(
      req.body.email_user,
      req.body.phone_number
    );
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.deactivateUser = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Deactivating user`);
    ObjLog.log(`[${context}]: Deactivating user`);
    let data = await usersPGRepository.deactivateUser(req.body.email_user);
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.getReferrals = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting referrals`);
    ObjLog.log(`[${context}]: Getting referrals`);
    let data = await usersPGRepository.getReferrals(req.query.cust_cr_cod_pub);
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.getReferralsOperations = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting referrals operations`);
    ObjLog.log(`[${context}]: Getting referrals operations`);
    let data = await usersPGRepository.getReferralsOperations(
      req.params.email_user
    );
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.getReferralsByCountry = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting referrals by country`);
    ObjLog.log(`[${context}]: Getting referrals by country`);
    let data = await usersPGRepository.getReferralsByCountry(
      req.params.email_user
    );
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.getReferralsByStatus = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting referrals by status`);
    ObjLog.log(`[${context}]: Getting referrals by status`);
    let data = await usersPGRepository.getReferralsByStatus(
      req.params.email_user
    );
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

usersService.ambassadorRequest = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Making ambassador request`);
    ObjLog.log(`[${context}]: Making ambassador request`);

    const mailResp = await mailSender.sendAmbassadorMail({
      email_user: req.params.email_user,
    });
    if (mailResp.mailResp && mailResp.mailResp === "Connection timed out")
      return {
        data: {
          mailResp,
        },
        status: 500,
        success: false,
        failed: true,
      };
    else
      return {
        data: {
          mailResp,
        },
        status: 200,
        success: true,
        failed: false,
      };
  } catch (error) {
    next(error);
  }
};

usersService.verifReferrallByCodPub = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Making ambassador request`);
    ObjLog.log(`[${context}]: Making ambassador request`);
    let data = await usersPGRepository.verifReferrallByCodPub(
      req.params.cust_cr_cod_pub
    );
    if (data && data.message === "Exists public code.")
      return {
        data: {
          mesage: data.message,
        },
        status: 200,
        success: true,
        failed: false,
      };
    else
      return {
        data: {
          mesage: "An error has ocurred.",
        },
        status: 500,
        success: false,
        failed: true,
      };
  } catch (error) {
    next(error);
  }
};

export default usersService;
export { events };
