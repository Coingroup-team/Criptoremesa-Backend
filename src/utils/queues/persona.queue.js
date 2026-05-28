import Queue from "bull";
import { env } from "../enviroment";
import { logger } from "../logger";

const context = "Persona Queue";

console.log("🎭 Creating message queue for Persona");

export const personaQueue = new Queue("personaQueue", {
  redis: {
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
    db: parseInt(env.REDIS_DB_PERSONA_QUEUE, 10),
    password: env.REDIS_PASSWORD,
    tls: {},
  },
});

export function addPersonaRequestToQueue(personaRequest) {
  logger.debug(`[${context}] New Persona request received in queue`);
  logger.info(
    `[${context}] Adding Persona inquiry ${personaRequest.personaInquiryId} to queue`
  );
  personaQueue.add(personaRequest);
}
