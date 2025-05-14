import { siltQueue } from "../queues/silt.queue";
import veriflevelsPGRepository from "../../modules/veriflevels/repositories/veriflevels.pg.repository";
import { logger } from "../logger";

const context = "SILT Queue";

siltQueue.process(1, async (job, done) => {
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