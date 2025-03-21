import Queue from 'bull';
import { env } from "../utils/enviroment";
import veriflevelsPGRepository from "../modules/veriflevels/repositories/veriflevels.pg.repository";
import { logger } from "../utils/logger";

const context = "SILT Queue";

console.log('🏍️Creando cola de mensajes para SILT');

const messageQueue = new Queue('siltQueue', {
    redis: {
        port: env.REDIS_PORT,
        host: env.REDIS_HOST,
        db: env.REDIS_DB_REM_QUEUE,
        password: env.REDIS_PASSWORD
    }
});

messageQueue.process(1, async (job, done) => {
    try {
        logger.debug(`[${context}] Processing SILT request`);
        
        const siltRequest = job.data;
        
        await veriflevelsPGRepository.levelOneVerfificationSilt(siltRequest);
        
        logger.info(`[${context}] SILT request processed`);
        done();
    } catch (error) {
        logger.error(`[${context}] SILT request error processing: ${error}`);
        done(error);
    }
});


// ✅ Exportamos la cola para usarla en Bull Board
export { messageQueue };

export function addSiltRequestToQueue(siltRequest) {
    logger.debug(`[${context}] New SILT request received in queue`);
    messageQueue.add(siltRequest);
}
