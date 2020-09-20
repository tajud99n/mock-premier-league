/**
 * Setup mongodb connection using mongoose.
 */
import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./logger";

const URI =
	config.environment === "test" ? config.mongodb.testUri : config.mongodb.uri;

export const connectDB = async () => {
	try {
		await mongoose.connect(URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});

		logger.info("MongoDB Connected...");
	} catch (err) {
		logger.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};
