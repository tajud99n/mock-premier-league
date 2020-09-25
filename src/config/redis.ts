/**
 * Setup redis connection.
 *
 */
import redis from "redis";
import { config } from "./config";
import { logger } from "./logger";

const redisClient = redis.createClient(config.redis.url);

redisClient.on("connect", function () {
	logger.info("Connection to redis has been established successfully.");
});

redisClient.on("error", function () {
	logger.error("Unable to connect to the redis instance");
	process.exit(1);
});
export default redisClient;
