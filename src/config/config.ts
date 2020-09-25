/**
 * load in environmental variables using dotenv
 * declare environmental variable in config object
 */
import dotenv from "dotenv";
dotenv.config();

interface IEnv {
	appName: string;
	baseURL: string;
	port: number;
	mongodb: IMongodb;
	environment: string;
	jwt: IJWT;
	salt: number;
	redis: any;
	windowSizeInHours: number;
	maxWindowRequestCount: number;
	windowLogInterval: number,
}

interface IMongodb {
	uri: string;
	testUri: string;
	collections: ICollections;
}

interface ICollections {
	user: string;
	admin: string;
	team: string;
	fixture: string;
}

interface IJWT {
	SECRETKEY: string;
	expires: number;
	issuer: string;
	alg: any;
}

const config: IEnv = {
	appName: "mock premier league",
	baseURL: process.env.BASE_URL!,
	environment: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT),
	mongodb: {
		uri: process.env.MONGO_DB_URI!,
		testUri: process.env.MONGO_DB_TEST!,
		collections: {
			user: "user",
			admin: "admin",
			team: "team",
			fixture: "fixture",
		},
	},
	jwt: {
		SECRETKEY: process.env.JWT_SECRET_KEY!,
		expires: Number(process.env.JWT_EXPIRY)!,
		issuer: process.env.ISSUER!,
		alg: process.env.JWT_ALG!,
	},
	salt: Number(process.env.SALT_ROUND)!,
	redis: {
		url: process.env.REDIS_URL!,
	},
	windowSizeInHours: Number(process.env.WINDOW_SIZE_IN_HOURS),
	maxWindowRequestCount: Number(process.env.MAX_WINDOW_REQUEST_COUNT),
	windowLogInterval: Number(process.env.WINDOW_LOG_INTERVAL_IN_HOURS),
};

export { config };
