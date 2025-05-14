import Queue from 'bull';
import { env } from "../enviroment";
import { logger } from "../logger";

const context = "SILT Queue";

console.log('🏍️Creando cola de mensajes para SILT');

// ✅ Exportamos la cola para usarla en Bull Board
export const siltQueue = new Queue('siltQueue', {
    redis: {
        port: env.REDIS_PORT,
        host: env.REDIS_HOST,
        db: env.REDIS_DB_SILT_QUEUE,
        password: env.REDIS_PASSWORD
    }
});

export function addSiltRequestToQueue(siltRequest) {
    logger.debug(`[${context}] New SILT request received in queue`);
    siltQueue.add(siltRequest);
}