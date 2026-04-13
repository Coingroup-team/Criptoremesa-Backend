import redis from "redis";
import { env } from "./enviroment";

if (process.env.ENVIROMENT !== "local") {
  const client = redis.createClient({
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT) || 6379,
    password: env.REDIS_PASSWORD,
    db: parseInt(env.REDIS_DB) || 1,
    read_timeout: parseInt(env.REDIS_READ_TIMEOUT) || 60,
  });

  client.on("error", function (error) {
    console.log("Redis client error:", error.message || error);
  });

  client.on("connect", function () {
    console.log(
      "✅ Redis client connected to",
      env.REDIS_HOST + ":" + env.REDIS_PORT,
    );
  });

  module.exports = client;
}
