/**
 * load in environmental variables using dotenv
 * declare environmental variable in config object
 */
import dotenv from "dotenv";
dotenv.config();

interface IEnv {
	appName: string;
	port: number;
	mongodb: IMongodb;
	environment: string;
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



const config: IEnv = {
	appName: "mock premier league",
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
};

export { config };
