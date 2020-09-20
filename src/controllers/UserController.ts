import { Request, Response } from "express";
import httpCodes from "http-status-codes";
import UserService from "../services/UserService";
import { http_responder } from "../utils/http_response";
import { CreateUserSchema } from "../utils/validations/user";
import utils from "../utils/utils";
import { IUser } from "../utils/types/custom";
import { logger } from "../config/logger";

/**
 * newUser
 * @desc A new user should be created
 * Route: POST: '/api/v1/register'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function newUser(req: Request, res: Response) {
	try {
		// validate request object
		const errors = await utils.validateRequest(req.body, CreateUserSchema);
		if (errors) {
			return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
		}
		const { name, email, password } = req.body;

		// check if user exists
		const existingUser = await UserService.getUserByEmail(email.toLowerCase());
		if (existingUser) {
			const errMessage = "User already exists";
			return http_responder.errorResponse(
				res,
				errMessage,
				httpCodes.BAD_REQUEST
			);
		}
		const userObject: IUser = {
			name: name.toLowerCase(),
			email: email.toLowerCase(),
			password: password,
		};

		// create user
		const user = await UserService.createUser(userObject);

		// * create token
		const token = user.generateAuthToken();

		const message = "User created successfully";
		// * return newly created user
		return http_responder.successResponse(
			res,
			{ user, token },
			message,
			httpCodes.CREATED
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			error.message,
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}
