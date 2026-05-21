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
    // env vars come from dotenv as strings; the previous expression
    // `env.REDIS_DB_SILT_QUEUE + 1` did string concatenation
    // ("11" + 1 = "111") which selects a non-existent Redis DB and
    // makes personaQueue.add() fail silently. Parse to int explicitly.
    // The env var should always be set; the fallback is only defense.
    db:
      parseInt(env.REDIS_DB_PERSONA_QUEUE, 10) ||
      parseInt(env.REDIS_DB_SILT_QUEUE, 10) + 1,
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
