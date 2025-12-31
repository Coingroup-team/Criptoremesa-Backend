import Queue from "bull";
import { env } from "../enviroment";
import { logger } from "../logger";

const context = "Persona Queue";

console.log("🎭 Creating message queue for Persona");

/**
 * Persona webhook queue
 * Handles asynchronous processing of Persona inquiry webhooks
 * Uses Redis for job persistence and Bull for queue management
 */
export const personaQueue = new Queue("personaQueue", {
  redis: {
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
    db: env.REDIS_DB_PERSONA_QUEUE || env.REDIS_DB_SILT_QUEUE + 1, // Use separate DB or SILT DB + 1
    password: env.REDIS_PASSWORD,
  },
});

/**
 * Add Persona webhook request to queue for asynchronous processing
 * @param {Object} personaRequest - Persona webhook data
 */
export function addPersonaRequestToQueue(personaRequest) {
  logger.debug(`[${context}] New Persona request received in queue`);
  logger.info(
    `[${context}] Adding Persona inquiry ${personaRequest.personaInquiryId} to queue`
  );
  personaQueue.add(personaRequest);
}
