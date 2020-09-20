/**
 * Utils object.
 * contains various helper function
 */
import { config } from "../config/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Joi from "@hapi/joi";

const Utils = {
	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(config.salt);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	},

	async validatePassword(
		password: string,
		passwordHash: string
	): Promise<boolean> {
		const isMatch = await bcrypt.compare(password, passwordHash);
		if (!isMatch) {
			return false;
		}
		return true;
	},

	verifyToken(token: string): any {
		try {
			const decoded = jwt.verify(token, config.jwt.SECRETKEY, {
				subject: config.appName,
				algorithms: [config.jwt.alg],
				issuer: config.jwt.issuer,
			});
			return decoded;
		} catch (error) {
			throw new Error("Invalid Token");
		}
	},

	async validateRequest(requestBody: any, validationSchema: Joi.Schema) {
		const errors = validationSchema.validate(requestBody);

		if (errors.error) {
			return errors.error.details[0].message;
		}
	},
};

export default Utils;
