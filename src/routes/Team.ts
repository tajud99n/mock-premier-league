import { Router } from "express";
import * as TeamController from "../controllers/TeamController";
import { authToken, authAdmin } from "../middlewares/Auth";
import { cachedTeam, cachedTeams } from "../middlewares/Cache";

const router = Router();

router.post("/", authToken, authAdmin, TeamController.newTeam);
router.get("/", authToken, cachedTeams, TeamController.getAllTeams);
router.get("/:id", authToken, cachedTeam, TeamController.getTeam);
router.put("/:id", authToken, authAdmin, TeamController.updateTeam);
router.delete("/:id", authToken, authAdmin, TeamController.removeTeam);


export default router;