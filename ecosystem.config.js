/**
 * Ecosystem file para PM2
 */
module.exports = {
    apps: [
      {
        name: "prod-be-bh",
        script: "node_modules/.bin/babel-node",
        args: "src/index.js",
        cwd: __dirname,
  
        // Escalabilidad
        instances: 1,             // o "max" para cluster mode
        exec_mode: "fork",   // "fork" o "cluster"
  
        // Reinicio automático
        autorestart: true,
        min_uptime: "10s",
        max_restarts: 10,
        exp_backoff_restart_delay: 100, // retardo exponencial
  
        // Logs locales
        error_file: "./logs/err.log",
        out_file: "./logs/out.log",
        merge_logs: true,
        log_date_format: "YYYY-MM-DD HH:mm Z",
  
        // Variables de entorno
        // env: {
        //   NODE_ENV: "development"
        // },
        // env_production: {
        //   NODE_ENV: "production"
        // }
      }
    ]
  };
  