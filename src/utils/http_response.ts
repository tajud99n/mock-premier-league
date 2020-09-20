/**
 * http_responder object.
 * to manage reponse for all incoming request
 * 
 */
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const http_responder = {
    async errorResponse(res: Response, message: string = '', statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        return res.status(statusCode).send({
            error: true,
            code: statusCode,
            message,
        });
    },

    async successResponse(res: Response, data: any = {}, message: string = '', statusCode: number = StatusCodes.OK) {
        return res.status(statusCode).send({
            error: false,
            code: statusCode,
            message,
            data,
        });
    },
}

export { http_responder };
