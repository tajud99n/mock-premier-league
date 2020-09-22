import { Request, Response } from 'express';
import { IRequestAdmin } from '../utils/types/custom';
import httpCodes from 'http-status-codes';
import { http_responder } from "../utils/http_response";
import moment from 'moment';
import FixtureService from '../services/FixtureService';
import TeamService from '../services/TeamService';
import Utils from '../utils/utils';
import { CreateFixtureSchema, UpdateFixtureSchema } from '../utils/validations/fixture';
import { logger } from '../config/logger';
import { uuid } from "uuidv4";

/**
 * newFixture
 * @desc An admin should be able to create fixture
 * Route: POST: '/api/v1/fixtures'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function newFixture(req: IRequestAdmin, res: Response) {
    try {
        const errors = await Utils.validateRequest(req.body, CreateFixtureSchema);
        if (errors) {
            return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
        }
        // home and away must be different teams
        if (req.body.home === req.body.away) {
            return http_responder.errorResponse(res, "home and away must be different teams", httpCodes.BAD_REQUEST);
        }

        const home: any = await TeamService.checkTeamById(req.body.home);
        const away: any = await TeamService.checkTeamById(req.body.away);

        if (!home || !away) {
            const errMessage = (home) ? "home does not exist" : "away does not exist";
            return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
        }

        // availability of both teams on that day
        const homeTeam = await FixtureService.checkAvailabityOfTeam(home._id, new Date(req.body.kick_off).toISOString());
        const awayTeam = await FixtureService.checkAvailabityOfTeam(away._id, new Date(req.body.kick_off).toISOString());

        if (homeTeam || awayTeam) {
            const errMessage = (homeTeam) ? `${home.name} has a fixture on the ${req.body.kick_off}` : `${away.name} has a fixture on the ${req.body.kick_off}`;
                return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
        }
        // * generate link and add to req body
        const fixtureId = uuid();

        const link = Utils.generateFixtureLink(fixtureId);

        const fixtureObject = {
            home: home._id,
            away: away._id,
            kickOff: req.body.kick_off,
            fixtureId,
            venue: home.stadium,
            link,
        };

        const fixture = await FixtureService.createFixture(fixtureObject);
        const homeFixtures = [...home.meta.fixtures, fixture._id];
        const awayFixtures = [...away.meta.fixtures, fixture._id];
        await TeamService.updateTeamFixtures(home._id, homeFixtures);
        await TeamService.updateTeamFixtures(away._id, awayFixtures);

        return http_responder.successResponse(res, { fixture }, "fixture created successfully", httpCodes.OK);
    } catch (error) {
        logger.error(JSON.stringify(error));
        return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * getFixture
 * @desc An admin get the details of a fixture with given id
 * Route: GET: '/api/v1/fixtures/:id'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function getFixture(req: Request, res: Response) {
    try {
        const fixtureId = req.params.id;

        const fixture = await FixtureService.findFixtureById(fixtureId);
        if (!fixture) {
            return http_responder.errorResponse(res, "no fixture found", httpCodes.NOT_FOUND);
        }
        return http_responder.successResponse(res, { fixture }, "fixture returned successfully", httpCodes.OK);
    } catch (error) {
        logger.error(JSON.stringify(error));
        return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
    }
}

export async function getAllFixtures(req: any, res: Response) {
    try {
        const defaultStartDate = new Date("1970-01-01").toISOString();
        const defaultEndDate = new Date().toISOString();
        const { limit, page } = req.query;
        const query = {
            startDate: req.query.startDate ? new Date(req.query.startDate).toISOString() : defaultStartDate,
            endDate: req.query.endDate ? new Date(req.query.endDate).toISOString() : defaultEndDate,
            status: req.query.status ? [req.query.status] : ["pending", "open", "closed"]
        }
        const fixtures = await FixtureService.findFixtures(query);
        if (!fixtures.length) {
            return http_responder.errorResponse(res, "no fixtures found", httpCodes.NOT_FOUND);
        }
        return http_responder.successResponse(res, { fixtures }, "fixtures found", httpCodes.OK);
    } catch (error) {
        logger.error(JSON.stringify(error));
        return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
    }
}


// export async function updateFixture(req: IRequestAdmin, res: Response) {
//     try {
//         const fixtureId = req.params.id;
//         const errors = await Utils.validateRequest(req.body, UpdateFixtureSchema);
//         if (errors) {
//             return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
//         }

//         const fixtureExists: any = await FixtureService.findFixtureById(fixtureId);
//         if (!fixtureExists) {
//             const errMessage = 'fixture does not exist';
//             return http_responder.errorResponse(res, errMessage, httpCodes.NOT_FOUND);
//         }

//         const fixtureObject: any = {};
//         if (req.body.home && req.body.away) {
//             // home and away must be different teams
//             if (req.body.home === req.body.away) {
//                 return http_responder.errorResponse(res, "home and away must be different teams", httpCodes.BAD_REQUEST);
//             }

//             const home: any = await TeamService.checkTeamById(req.body.home);
//             const away: any = await TeamService.checkTeamById(req.body.away);

//             if (!home || !away) {
//                 const errMessage = (home) ? "home does not exist" : "away does not exist";
//                 return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
//             }

//             const kickOff = (req.body.kick_off) ? req.body.kick_off : fixtureExists.kickOff;
//             // availability of both teams on that day
//             const homeTeam = await FixtureService.checkAvailabityOfTeam(home._id, kickOff);
//             const awayTeam = await FixtureService.checkAvailabityOfTeam(away._id, req.body.kick_off);

//             if (homeTeam || awayTeam) {
//                 const errMessage = (homeTeam) ? `${home.name} has a fixture clash` : `${away.name} has a fixture clash`;
//                 return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
//             }
//         } else {

//             let home: any
//             if (req.body.home) {
//                 home = await TeamService.checkTeamById(req.body.home);
//                 if (!home) {
//                     return http_responder.errorResponse(res, "home does not exist", httpCodes.BAD_REQUEST);
//                 }

//                 if (home._id.equals(fixtureExists.away._id)) {

//                 }
//             }
//             let away: any
//             if (req.body.away) {
//                 away = await TeamService.checkTeamById(req.body.away);
//                 if (!away) {
//                     return http_responder.errorResponse(res, "away does not exist", httpCodes.BAD_REQUEST);
//                 }
//             }

//         }

        
//         // availability of both teams on that day
//         const kickOff = (req.body.kick_off) ? req.body.kick_off : fixtureExists.kickOff; 
//         const homeTeam = await FixtureService.checkAvailabityOfTeam(home._id, kickOff);
//         const awayTeam = await FixtureService.checkAvailabityOfTeam(away._id, kickOff);

//         if (homeTeam || awayTeam) {
//             const errMessage = (homeTeam) ? `${home.name} has a fixture on the ${req.body.kick_off}` : `${away.name} has a fixture on the ${req.body.kick_off}`;
//             return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
//         }

//         fixtureObject = {
//             home: home._id,
//             away: away._id,
//             kickOff,
//             venue: home.stadium
//         };

//         const fixture = await FixtureService.updateFixture(fixtureId, { ...req.body, ...fixtureObject });

//         const message = 'Fixture updated successfully';
//         return http_responder.successResponse(res, { fixture }, message, httpCodes.OK);
//     } catch (error) {
//         logger.error(JSON.stringify(error));
//         return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
//     }
// }

/**
 * removeTeam
 * @desc An admin should remove a fixture with the given id when the fixture is still pending
 * Route: DELETE: '/api/v1/fixtures'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function removeFixture(req: IRequestAdmin, res: Response) {
    try {
    const fixtureId = req.params.id;
    const fixture = await FixtureService.checkFixtureStatus(fixtureId);

    if (!fixture) {
        const errMessage = 'fixture cannot be deleted';
        return http_responder.errorResponse(res, errMessage, httpCodes.BAD_REQUEST);
    }
    
        const response = await FixtureService.removeFixture(fixtureId);

        return http_responder.successResponse(res, [], "fixture deleted successfully", httpCodes.OK);
    } catch (error) {
        logger.error(JSON.stringify(error));
        return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
    }
}