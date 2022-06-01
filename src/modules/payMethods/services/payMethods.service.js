import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import payMethodsRepository from "../repositories/payMethods.pg.repository";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
const payMethodsService = {};
const context = "pay Methods Service";
const logConst = {
  is_auth: undefined,
  success: true,
  failed: false,
  ip: undefined,
  country: undefined,
  route: "/pay_methods",
  session: null,
};

payMethodsService.getPayMethodsByCountryAndCurrency = async (req, res, next) => {
  try {

    let log  = logConst;
    log.is_auth = req.isAuthenticated()
    log.ip = req.connection.remoteAddress;
    let data = {}
    const resp = await authenticationPGRepository.getIpInfo(req.connection.remoteAddress);
    if (resp) log.country = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID)) log.session = req.sessionID;
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      log.success = false;
      log.failed = true;
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    }
    else{
      await authenticationPGRepository.insertLogMsg(log);
      logger.info(`[${context}]: Get Pay Methods by Country and Currency`);
      ObjLog.log(`[${context}]: Get Pay Methods by Country and Currency`);
      data = await payMethodsRepository.getPayMethodsByCountryAndCurrency(req.query.id_country,req.query.id_currency,req.query.only_pay);
      res.status(200).json(data);
    }
    
  } catch (error) {
    next(error);
  }
};

payMethodsService.getPayMethodById = async (req, res, next) => {
  try {

    let log  = logConst;
    log.is_auth = req.isAuthenticated()
    log.ip = req.connection.remoteAddress;
    let data = {}
    const resp = await authenticationPGRepository.getIpInfo(req.connection.remoteAddress);
    if (resp) log.country = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID)) log.session = req.sessionID;
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      log.success = false;
      log.failed = true;
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    }
    else{
      await authenticationPGRepository.insertLogMsg(log);
      logger.info(`[${context}]: Get Pay Methods by Country`);
      ObjLog.log(`[${context}]: Get Pay Methods by Country`);
      data = await payMethodsRepository.getPayMethodById(req.params.pay_method_id);
      res.status(200).json(data);
    }
    
  } catch (error) {
    next(error);
  }
};

payMethodsService.deposit_method_by_country = async (req, res, next) => {
  try {

    let log  = logConst;
    log.is_auth = req.isAuthenticated()
    log.ip = req.connection.remoteAddress;
    let data = {}
    const resp = await authenticationPGRepository.getIpInfo(req.connection.remoteAddress);
    if (resp) log.country = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID)) log.session = req.sessionID;
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      log.success = false;
      log.failed = true;
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    }
    else{
      await authenticationPGRepository.insertLogMsg(log);
      logger.info(`[${context}]: Get deposit Methods by Country`);
      ObjLog.log(`[${context}]: Get deposit Methods by Country`);
      data = await payMethodsRepository.deposit_method_by_country(req.params.id_country,req.params.id_bank);
      res.status(200).json(data);
    }
    
  } catch (error) {
    next(error);
  }
};

payMethodsService.depositMethodsByBank = async (req, res, next) => {
  try {

    let log  = logConst;
    log.is_auth = req.isAuthenticated()
    log.ip = req.connection.remoteAddress;
    let data = {}
    const resp = await authenticationPGRepository.getIpInfo(req.connection.remoteAddress);
    if (resp) log.country = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID)) log.session = req.sessionID;
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      log.failed = true;
      log.success = false
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    }else{
      await authenticationPGRepository.insertLogMsg(log);
      logger.info(`[${context}]: Get Pay Method by bank`);
      ObjLog.log(`[${context}]: Get Pay Method by bank`);
      data = await payMethodsRepository.depositMethodsByBank(req.params.id_bank);
      res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

export default payMethodsService;