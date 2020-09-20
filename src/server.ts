import { app } from "./app";
import { config } from "./config/config";
import { logger } from "./config/logger";

// Start Server
app.listen(config.port, () =>
	logger.info(`App listening on port - ${config.port}`)
);
