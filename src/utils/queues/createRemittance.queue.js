import Queue from 'bull';
import { env } from "../enviroment";
import { logger } from "../logger";

const context = "Create Remittance Queue";

console.log('🏍️Creando cola de mensajes para REMESAS');

// ✅ Exportamos la cola para usarla en Bull Board
export const remittanceQueue = new Queue('createRemittances', {
    redis: {
        port: env.REDIS_PORT,
        host: env.REDIS_HOST,
        db: env.REDIS_DB_REM_QUEUE,
        password: env.REDIS_PASSWORD
    }
})

export async function addRemittanceToQueue(remittanceBody) {
    logger.debug(`[${context}] New message received in queue`);
    await remittanceQueue.add(remittanceBody, {
        attempts: 3,
        backoff: { type: 'fixed', delay: 1000 }
      });
}