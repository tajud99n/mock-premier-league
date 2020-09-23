import { Request, Response } from "express";
import { ITeam, IRequestAdmin } from "../utils/types/custom";
import TeamService from "../services/TeamService";
import FixtureService from "../services/FixtureService";
import httpCodes from "http-status-codes";
import { logger } from "../config/logger";
import { http_responder } from "../utils/http_response";
import { CreateTeamSchema, UpdateTeamSchema } from "../utils/validations/team";
import Utils from "../utils/utils";
import { uuid } from "uuidv4";

/**
 * newTeam
 * @desc An admin should be able to create a team
 * Route: POST: '/api/v1/teams'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function newTeam(req: IRequestAdmin, res: Response) {
	try {
		const errors = await Utils.validateRequest(req.body, CreateTeamSchema);
		if (errors) {
			return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
		}

		const existingTeam = await TeamService.findTeamByName(
			req.body.name.toLowerCase()
		);
		if (existingTeam) {
			const errMessage = "team already exists";
			return http_responder.errorResponse(
				res,
				errMessage,
				httpCodes.BAD_REQUEST
			);
		}
		
		const createdBy = req.user?._id;
		const teamObject: ITeam = {
			name: req.body.name.toLowerCase(),
			manager: req.body.manager.toLowerCase(),
			teamId: uuid(),
			color: req.body.color.toLowerCase(),
			stadium: req.body.stadium.toLowerCase(),
			meta: {
				nickname: (req.body.nickname) ? req.body.nickname.toLowerCase() : null,
			},
			createdBy,
		};

		// save Team
		const team = await TeamService.createTeam(teamObject);

		return http_responder.successResponse(
			res,
			{ team },
			"Team created successfully",
			httpCodes.CREATED
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			"server error",
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}

/**
 * getTeam
 * @desc An admin get the details of a team with given id
 * Route: GET: '/api/v1/teams/:id'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function getTeam(req: Request, res: Response) {
	try {
		const teamId = req.params.id;

		const team: any = await TeamService.findTeamById(teamId);

		if (!team) {
			return http_responder.errorResponse(
				res,
				"team not found",
				httpCodes.NOT_FOUND
			);
		}

		return http_responder.successResponse(
			res,
			{ team },
			"team found",
			httpCodes.OK
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			"server error",
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}

/**
 * updateTeam
 * @desc An admin should be able to update a team with the given id
 * Route: PUT: '/api/v1/teams/:id'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function updateTeam(req: IRequestAdmin, res: Response) {
	try {
		const teamId = req.params.id;

		const errors = await Utils.validateRequest(req.body, UpdateTeamSchema);
		if (errors) {
			return http_responder.errorResponse(res, errors, httpCodes.BAD_REQUEST);
		}

		const team = await TeamService.checkTeamById(teamId);
		if (!team) {
			return http_responder.errorResponse(res, "team does not exist", httpCodes.NOT_FOUND);
		}

		if (req.body.name) {
			const existingTeam = await TeamService.findTeamByName(req.body.name.toLowerCase());

			if (existingTeam) {
				return http_responder.errorResponse(res, "team already exists", httpCodes.BAD_REQUEST);
			}
		}

		const updateObject: any = {};

		updateObject.name = (req.body.name) ? req.body.name.toLowerCase() : team.name;
		updateObject.manager = (req.body.manager) ? req.body.manager.toLowerCase() : team.manager;
		updateObject.color = (req.body.color) ? req.body.color.toLowerCase() : team.color;
		updateObject.stadium = (req.body.stadium) ? req.body.stadium.toLowerCase() : team.stadium;
		updateObject["meta.nickname"] = (req.body.nickname) ? req.body.nickname.toLowerCase() : team.meta.nickname;
		const updatedTeam = await TeamService.updateTeam(team._id, updateObject);
		return http_responder.successResponse(
			res,
			{ team: updatedTeam },
			"team updated successfully",
			httpCodes.OK
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			"server error",
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}

/**
 * getAllTeams
 * @desc An admin should get all the teams
 * Route: GET: '/api/v1/teams'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function getAllTeams(req: any, res: Response) {
	try {
		const teams: any = await TeamService.getAllTeams();

		if (!teams.length) {
			return http_responder.errorResponse(
				res,
				"no teams found",
				httpCodes.NOT_FOUND
			);
		}

		return http_responder.successResponse(
			res,
			teams,
			"teams found",
			httpCodes.OK
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			"server error",
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}

/**
 * removeTeam
 * @desc An admin should remove a team with the given id
 * Route: DELETE: '/api/v1/teams'
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {void|Object} object
 */
export async function removeTeam(req: any, res: Response) {
	try {
		const teamId = req.params.id;

		const team: any = await TeamService.removeTeam(teamId);

		return http_responder.successResponse(
			res,
			[],
			"team deleted successfully",
			httpCodes.OK
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(
			res,
			"server error",
			httpCodes.INTERNAL_SERVER_ERROR
		);
	}
}

export async function search(req: Request, res: Response) {
	const search: any = req.query.search;
	try {
		const team = await TeamService.search(search);
		const fixture = await FixtureService.search(search);
		const results = [...team, ...fixture ]

		return http_responder.successResponse(res, { results }, "search results returned", httpCodes.OK);
	} catch (error) {
		logger.error(JSON.stringify(error));
		return http_responder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
	}
}