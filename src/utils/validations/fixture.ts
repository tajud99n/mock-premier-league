import Joi from "@hapi/joi";

export const CreateFixtureSchema = Joi.object({
	home: Joi.string().required(),
	away: Joi.string().required(),
	kick_off: Joi.date().required(),
});

export const UpdateFixtureSchema = Joi.object({
	kick_off: Joi.date(),
	status: Joi.string(),
	score_home: Joi.number(),
	score_away: Joi.number(),
});
