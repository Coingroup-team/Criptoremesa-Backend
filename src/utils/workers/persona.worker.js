import { personaQueue } from "../queues/persona.queue";
import veriflevelsPGRepository from "../../modules/veriflevels/repositories/veriflevels.pg.repository";
import { logger } from "../logger";

const context = "Persona Queue";

/**
 * Persona webhook queue worker
 * Processes Persona inquiry webhooks asynchronously
 * Mirrors SILT worker pattern for consistency
 */
personaQueue.process(1, async (job, done) => {
  try {
    logger.debug(`[${context}] Processing Persona request`);

    const personaRequest = job.data;

    // Check if this is an enhanced Persona request with additional document data
    const hasEnhancedData =
      personaRequest.personalNumber ||
      personaRequest.expiryDate ||
      personaRequest.documentAddress ||
      personaRequest.documentType ||
      personaRequest.documentNumber;

    if (hasEnhancedData) {
      logger.info(
        `[${context}] Processing enhanced Persona request with additional document data`
      );
      await veriflevelsPGRepository.levelOneVerificationPersonaEnhanced(
        personaRequest
      );
    } else {
      logger.info(`[${context}] Processing standard Persona request`);
      // For now, we always use enhanced version since it handles both cases
      await veriflevelsPGRepository.levelOneVerificationPersonaEnhanced(
        personaRequest
      );
    }

    logger.info(`[${context}] Persona request processed successfully`);
    done();
  } catch (error) {
    logger.error(`[${context}] Persona request error processing: ${error}`);
    logger.error(`[${context}] Error stack: ${error.stack}`);
    done(error);
  }
});

logger.info(`[${context}] Persona worker initialized and listening for jobs`);
