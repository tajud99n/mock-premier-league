import { Response } from "express";
import { IRequestUser, IRequestAdmin } from "../utils/types/custom";
import UserService from "../services/UserService";
import httpCodes from "http-status-codes";
import { logger } from "../config/logger";
import { http_responder } from "../utils/http_response";
import { CredentialSchema } from "../utils/validations/auth";
import Utils from "../utils/utils";
import AdminService from "../services/AdminService";

/**
 * loginUser
 * @desc As a user with correct credentials you should be able login
 * Route: POST: '/api/v1/login'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function loginUser(req: IRequestUser, res: Response) {
	try {
		const errors = await Utils.validateRequest(req.body, CredentialSchema);
		if (errors) {
			return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
		}

		// check if user exists
		const email = req.body.email.toLowerCase();

		const user: any = await UserService.getUserByEmail(email);
		if (!user) {
			const errMessage = "Invalid login credentials";
			return http_responder.errorResponse(res, errMessage, httpCodes.NOT_FOUND);
		}

		// verify password and generate token
		const passwordMatch = await Utils.validatePassword(
			req.body.password,
			user.password
		);
		if (!passwordMatch) {
			const errMessage = "Invalid login credentials";
			return http_responder.errorResponse(
				res,
				errMessage,
				httpCodes.UNAUTHORIZED
			);
		}
		const token = user.generateAuthToken();

		const message = "User login successful";
		return http_responder.successResponse(
			res,
			{ user, token },
			message,
			httpCodes.OK
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

/**
   * loginAdmin
   * @desc As an admin you should be able login
   * Route: POST: '/api/v1/admin/login'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
export async function loginAdmin(req: IRequestAdmin, res: Response) {
    try {
        const errors = await Utils.validateRequest(req.body, CredentialSchema);
        if (errors) {
            return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
        }

        // check if user exists
        const email = req.body.email.toLowerCase();

        const admin: any = await AdminService.getAdminByEmail(email);
        if (!admin) {
            const errMessage = 'Invalid login credentials';
            return http_responder.errorResponse(res, errMessage, httpCodes.NOT_FOUND);
        }

        // verify password and generate token
        const passwordMatch = await Utils.validatePassword(req.body.password, admin.password);
        if (!passwordMatch) {
            const errMessage = "Invalid login credentials";
            return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
        }
        const token = admin.generateAuthToken();

        const message = 'User login successful';
        return http_responder.successResponse(res, { user: admin, token }, message, httpCodes.OK);
  
    } catch (error) {
        logger.error(JSON.stringify(error));
		return http_responder.errorResponse(res, error.message, httpCodes.INTERNAL_SERVER_ERROR);
    }
}