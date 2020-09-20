import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { StatusCodes } from "http-status-codes";
import { http_responder } from "./utils/http_response";
import BaseRouter from "./routes";

// Init express
const app: Application = express();



app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
app.use('/api/v1', BaseRouter);

app.get("/", (req: Request, res: Response) => {
    return http_responder.successResponse(
        res,
        { githubUrl: "https://github.com/tajud99n/mock-premier-league.git" },
        "welcome to mock league Service"
    );
});


// handle errors
app.all("/*", (req: Request, res: Response) => {
    return http_responder.errorResponse(
			res,
			`${StatusCodes.NOT_FOUND} - Not found`,
			StatusCodes.NOT_FOUND
		);
});

app.use((err: any, req: Request, res: Response) => {
    return http_responder.errorResponse(
			res,
			err.message,
			err.status || StatusCodes.INTERNAL_SERVER_ERROR
		);
});


export { app };
