// createRemittance.worker.js
import { remittanceQueue } from '../queues/createRemittance.queue.js';
import remittancesPGRepository from '../../modules/remittances/repositories/remittances.pg.repository.js';
import { poolSM } from '../../db/pg.connection.js';
import { logger } from '../logger.js';

const ctx = 'Create Remittance Queue';
async function getUserIdByEmail(email) {
  if (!email) return null;
  const { rows } = await poolSM.query(
    'SELECT id_user FROM sec_cust.ms_sixmap_users WHERE LOWER(TRIM(email_user)) = LOWER(TRIM($1))',
    [email]
  );
  return rows[0]?.id_user ?? null;
}

remittanceQueue.process(20, async job => {
  const payload = job.data;
  try {
    // 1) inyectar id_user_cr_id
    const userId = await getUserIdByEmail(payload.email_user);
    if (!userId) throw new Error(`User not found: ${payload.email_user}`);
    payload.id_user_cr_id = userId;

    // 2) llamar al repositorio
    await remittancesPGRepository.startRemittance(payload);

    logger.info(`[${ctx}] Job ${job.id} completed ✅`);
  } catch (err) {
    // Aquí atrapas TODO el error
    logger.error(`[${ctx}] Job ${job.id} failed – ${err.message}`, err.stack);
    // opcionalmente: job.log(err.stack)
    throw err;
  }
});


// ──────────────────────────────────────────────────────────────────────────
// Listeners de observabilidad
// ──────────────────────────────────────────────────────────────────────────
remittanceQueue
  .on('failed', (job, err) =>
    logger.error(`[${ctx}] Job ${job.id} failed – ${err.message}`)
  )
  .on('completed', job =>
    logger.info(`[${ctx}] Job ${job.id} completed in ${job.finishedOn - job.processedOn} ms`)
  )
  .on('stalled', job =>
    logger.warn(`[${ctx}] Job ${job.id} stalled`)
)
  .on('progress', (job, progress) =>
    logger.info(`[${ctx}] Job ${job.id} progress: ${progress}%`)
  )
  .on('waiting', jobId =>
    logger.info(`[${ctx}] Job ${jobId} waiting`)
  )
  .on('paused', jobId =>
    logger.info(`[${ctx}] Job ${jobId} paused`)
  )
  .on('resumed', jobId =>
    logger.info(`[${ctx}] Job ${jobId} resumed`)
  )
  .on('removed', jobId =>
    logger.info(`[${ctx}] Job ${jobId} removed`)
  )
  .on('cleaned', (jobs, type) =>
    logger.info(`[${ctx}] Cleaned ${jobs.length} jobs of type ${type}`)
  )
  .on('error', err =>
    logger.error(`[${ctx}] Queue error: ${err.message}`)
  );

remittanceQueue
.on('global:failed', async (jobId, err) => {
  logger.error(`[${ctx}] GLOBAL Job ${jobId} failed – ${err?.message || 'no error message'}`);
  // Opcional: obtener detalles del job si quieres
  const job = await remittanceQueue.getJob(jobId);
  if (job) {
    logger.error(`[${ctx}] GLOBAL Payload: ${JSON.stringify(job.data)}`);
  }
})
.on('global:completed', jobId => {
  logger.info(`[${ctx}] GLOBAL Job ${jobId} completed`);
})
.on('global:stalled', jobId => {
  logger.warn(`[${ctx}] GLOBAL Job ${jobId} stalled`);
})
.on('error', err => {
  logger.error(`[${ctx}] Queue error: ${err.message}`);
});


