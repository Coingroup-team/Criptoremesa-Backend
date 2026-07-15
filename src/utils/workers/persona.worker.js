import { personaQueue } from "../queues/persona.queue";
import veriflevelsPGRepository from "../../modules/veriflevels/repositories/veriflevels.pg.repository";
import usersPGRepository from "../../modules/users/repositories/users.pg.repository";
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

    // Persona aprobada (SUCCESS = subió a nivel 1 / Intermedio): apagar el flag
    // has_downgraded_level para que el banner de "bajaste a nivel básico" deje de
    // mostrarse. Best-effort: si el UPDATE falla no debe romper el webhook (el usuario
    // igual quedó aprobado y puede cerrar el banner manualmente).
    if (personaRequest.personaStatus === "SUCCESS" && personaRequest.emailUser) {
      try {
        await usersPGRepository.dismissDowngradeNotice(personaRequest.emailUser);
        logger.info(
          `[${context}] has_downgraded_level cleared for approved user ${personaRequest.emailUser}`
        );
      } catch (flagError) {
        logger.error(
          `[${context}] Could not clear has_downgraded_level for ${personaRequest.emailUser}: ${flagError}`
        );
      }
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
