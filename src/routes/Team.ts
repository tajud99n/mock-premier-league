import { Router } from "express";
import * as TeamController from "../controllers/TeamController";
import { authToken, authAdmin } from "../middlewares/Auth";

const router = Router();

router.post("/", authToken, authAdmin, TeamController.newTeam);
router.get("/", authToken, authAdmin, TeamController.getAllTeams);
router.get("/:id", authToken, authAdmin, TeamController.getTeam);
router.put("/:id", authToken, authAdmin, TeamController.updateTeam);
router.delete("/:id", authToken, authAdmin, TeamController.removeTeam);


export default router;