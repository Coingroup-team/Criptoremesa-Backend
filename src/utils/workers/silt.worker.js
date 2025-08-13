import { siltQueue } from "../queues/silt.queue";
import veriflevelsPGRepository from "../../modules/veriflevels/repositories/veriflevels.pg.repository";
import { logger } from "../logger";

const context = "SILT Queue";

siltQueue.process(1, async (job, done) => {
    try {
        logger.debug(`[${context}] Processing SILT request`);
        
        const siltRequest = job.data;
        
        // Check if this is an enhanced SILT request with additional document data
        const hasEnhancedData = siltRequest.personalNumber || siltRequest.expiryDate || siltRequest.documentAddress;
        
        if (hasEnhancedData) {
            logger.info(`[${context}] Processing enhanced SILT request with additional document data`);
            await veriflevelsPGRepository.levelOneVerfificationSiltEnhanced(siltRequest);
        } else {
            logger.info(`[${context}] Processing standard SILT request`);
            await veriflevelsPGRepository.levelOneVerfificationSilt(siltRequest);
        }
        
        logger.info(`[${context}] SILT request processed`);
        done();
    } catch (error) {
        logger.error(`[${context}] SILT request error processing: ${error}`);
        done(error);
    }
});