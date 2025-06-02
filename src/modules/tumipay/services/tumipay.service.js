import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
import { WebpayPlus } from "transbank-sdk";
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from "transbank-sdk"
const { v4: uuidv4 } = require('uuid');
import tumipayRepository from "../repositories/tumipay.repository";

const tumipayService = {};
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

tumipayService.createTumipayTransaction = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Creating tumipay transaction`);
    ObjLog.log(`[${context}]: Creating tumipay transaction`);

    let data = await tumipayRepository.createTumipayTransaction(req.body);

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


export default tumipayService;