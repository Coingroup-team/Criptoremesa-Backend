import Queue from 'bull';
import { env } from "../../../utils/enviroment";
import remittancesPGRepository from "../repositories/remittances.pg.repository";
import { logger } from "../../../utils/logger";

const context = "Create Remittance Queue";

const messageQueue = new Queue('createRemittances', {
    redis: {
        port: env.REDIS_PORT,
        host: env.REDIS_HOST,
        db: env.REDIS_DB_REM_QUEUE,
        password: env.REDIS_PASSWORD
    }
})

messageQueue.process(20, async (remittance, done) => {
    try {
        logger.debug(`[${context}] Creating remittance`);
        await remittancesPGRepository.startRemittance(remittance.data);
        logger.info(`[${context}] Remittance created`);
        done();
    } catch (error) {
        logger.error(`[${context}] Remittance not created: ${error}`);
        done(error);
    }
})

export function addRemittanceToQueue(remittanceBody) {
    logger.debug(`[${context}] New message received in queue`);
    messageQueue.add(remittanceBody);
}