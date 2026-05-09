import axios from 'axios';
import { env } from "../utils/enviroment";
import { poolSM } from "../../src/db/pg.connection";
import { logger } from "../utils/logger";

const context = "MAIL MODULE";

async function log(email_user,url,body,response) {
  try {
    logger.info(`[${context}]: Logging mail info in database`)
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM sp_mail_logs_insert_call_to_mail_server(
                                                                                              '${email_user}',
                                                                                              '${url}',
                                                                                              ($1),
                                                                                              '${response}'
                                                                                          )`,
                                                                                          [body]);
    return resp.rows[0];
  } catch (error) {
    log(body.email_user,url,body,error)
    logger.error(error);
    throw error;
  }
}

export default {
  sendForgotPasswordMail: async (body) => {
    let url = `${env.MAIL_SENDER}/sendForgotPasswordMail`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  },
  sendSignUpMail: async (body) => {
    let url = `${env.MAIL_SENDER}/sendSignUpMail`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  },
  sendVerifyActionMail: async (body) => {
    let url = `${env.MAIL_SENDER}/sendVerifyActionMail`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  },
  sendAmbassadorMail: async (body) => {
    let url = `${env.MAIL_SENDER}/sendAmbassadorMail`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  },
  sendIndustryAlertMail: async (body) => {
    let url = `${env.MAIL_SENDER}/mail`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  },
  sendAnyMail: async (req,res) => {
    let url = `${env.MAIL_SENDER}/mail`
    try {
      let resp = await axios.post(url,req.body)
      log(req.body.email_user,url,req.body,resp.data)
      console.log('resp.data: ',resp.data)
      if (resp.data === 'Email succesfully sent')
        res.status(200).json(resp.data);
      else 
        res.status(500).json(resp.data);
    } catch (error) {
      log(req.body.email_user,url,req.body,error)
      return error;
    }
  },
  sendWelcomeMail: async (body) => {
    let url = `${env.MAIL_SENDER}/welcome`
    try {
      let resp = await axios.post(url,body)
      log(body.email_user,url,body,resp.data)
      return resp.data;
    } catch (error) {
      log(body.email_user,url,body,error)
      return error;
    }
  }
};