import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
import { WebpayPlus } from "transbank-sdk";
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from "transbank-sdk"
const { v4: uuidv4 } = require('uuid');

const transbankService = {};
const context = "transbank Service";

const getCurrentDomain = () => {
  if(env.PG_DB_SM_NAME === 'dev-cg' && env.ENVIROMENT === 'local'){
    return "http://localhost:8080";
  }
  else if(env.PG_DB_SM_NAME === 'dev-cg'){
    return "https://bhdev.bithonor.com";
  } else if (env.PG_DB_SM_NAME === 'test-cg'){
    return "https://bhtest.bithonor.com";
  } else if (env.PG_DB_SM_NAME === 'PROD-cg') {
    return "https://bithonor.com";
  } else {
    return "https://bhdev.bithonor.com";
  }
}

transbankService.getWebpayTransaction = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Creating transaction`);
    ObjLog.log(`[${context}]: Creating transaction`);

    let buyOrder = uuidv4().replace(/-/g, '').substring(0, 26);
    let sessionId = '12345678';
    let amount = req.query.amount; 
    let returnUrl = `${getCurrentDomain()}/enviar-dinero/sin-comprobante`;

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const data = await tx.create(buyOrder, sessionId, amount, returnUrl);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

transbankService.confirmWebpayTransaction = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Confirming transaction`);
    ObjLog.log(`[${context}]: Confirming transaction`);

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const data = await tx.commit(req.query.token);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

transbankService.confirmWebpayTransactionNoEndpoint = async (token) => {
  try {
    logger.info(`[${context}]: Confirming transaction`);
    ObjLog.log(`[${context}]: Confirming transaction`);

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const data = await tx.commit(token);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    throw(error);
  }
};

export default transbankService;