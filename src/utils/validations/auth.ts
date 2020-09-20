import Joi from "@hapi/joi";

export const CredentialSchema = Joi.object({
	email: Joi.string().required().lowercase().email(),
	password: Joi.string().required().min(6),
});
