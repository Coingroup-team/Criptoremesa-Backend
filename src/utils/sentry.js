import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { logger } from './logger.js';

import { SENTRY_ENVS, VALID_SENTRY_ENVS } from './enviroment.js';

if (process.env.NODE_ENV !== "production")
    require('dotenv').config()

const TRACE_SAMPLE_RATE_PER_ENV = {
  [SENTRY_ENVS.DEVELOPMENT]: 0.1,
  [SENTRY_ENVS.PRODUCTION]: 0.1,
  [SENTRY_ENVS.LOCAL]: 0.1
};

const PROFILES_SAMPLE_RATE_PER_ENV = {
  [SENTRY_ENVS.DEVELOPMENT]: 0.05,
  [SENTRY_ENVS.PRODUCTION]: 0.05,
  [SENTRY_ENVS.LOCAL]: 0.05
};

if (VALID_SENTRY_ENVS.includes(process.env.SENTRY_ENV)) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.RELEASE || 'local',
    integrations: [
      // Enable Profiling
      nodeProfilingIntegration(),
      Sentry.replayIntegration({
        networkDetailAllowUrls: [
          window.location.origin,
          'http://ec2-3-143-246-144.us-east-2.compute.amazonaws.com:3003/',
          'https://cai.nimobot.com',
          'https://23wz6wm57c.execute-api.us-east-1.amazonaws.com',
          'https://g4eq6v66ac.execute-api.us-east-1.amazonaws.com'
        ],
      }),
    ],
    tracesSampleRate: TRACE_SAMPLE_RATE_PER_ENV[process.env.SENTRY_ENV],
    profilesSampleRate: PROFILES_SAMPLE_RATE_PER_ENV[process.env.SENTRY_ENV],
    environment: process.env.SENTRY_ENV
  });
} else {
  // TODO: update when the new logging is implemented
  logger.info(
    `You are trying to initialize Sentry with an invalid ENV. Please use one of ${VALID_SENTRY_ENVS.join(
      ' | '
    )}`
  );
}