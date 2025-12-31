/** PM2 ecosystem */
module.exports = {
  apps: [
    {
      name: "prod-be-bh:api",
      script: "node_modules/.bin/babel-node",
      args: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      error_file: "./logs/api-err.log",
      out_file: "./logs/api-out.log",
    },
    {
      name: "prod-be-bh:rem-worker",
      script: "node_modules/.bin/babel-node",
      args: "src/utils/workers/createRemittance.worker.js",
      instances: 1, // ¡no escalar!
      exec_mode: "fork",
      autorestart: true,
      watch: false, // nada de watch en workers
      error_file: "./logs/rem-err.log",
      out_file: "./logs/rem-out.log",
    },
    {
      name: "prod-be-bh:silt-worker",
      script: "node_modules/.bin/babel-node",
      args: "src/utils/workers/silt.worker.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      error_file: "./logs/silt-err.log",
      out_file: "./logs/silt-out.log",
    },
    {
      name: "prod-be-bh:persona-worker",
      script: "node_modules/.bin/babel-node",
      args: "src/utils/workers/persona.worker.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      error_file: "./logs/persona-err.log",
      out_file: "./logs/persona-out.log",
    },
  ],
};
