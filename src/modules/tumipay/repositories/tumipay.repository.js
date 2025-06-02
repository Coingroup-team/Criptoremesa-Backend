import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import axios from "axios";

const tumipayRepository = {};
const context = "tumipay PG Repository";

tumipayRepository.createTumipayTransaction = async (payload) => {
  try {
    logger.info(`[${context}]: Creating tumipay transaction`);
    ObjLog.log(`[${context}]: Creating tumipay transaction`);
    console.log('tumipay payload', payload);
    console.log('tumipay url', process.env.TUMIPAY_URL);
    const resp = await axios.post(process.env.TUMIPAY_URL, payload);
    console.log('tumipay response', resp.data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export default tumipayRepository;