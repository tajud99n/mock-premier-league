import Joi from '@hapi/joi';

export const CreateFixtureSchema = Joi.object({
    home: Joi.string().required(),
    away: Joi.string().required(),
    kick_off: Joi.date().required(),
});

export const UpdateFixtureSchema = Joi.object({
    home: Joi.string(),
    away: Joi.string(),
    kick_off: Joi.date(),
    status: Joi.string(),
    report: Joi.object().keys({
        socres: Joi.object().keys({
            home: Joi.number(),
            away: Joi.number(),
        })
    }),
    link: Joi.string(),
});