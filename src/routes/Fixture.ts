import { Router } from "express";
import * as FixtureController from "../controllers/FixtureController";
import { authToken, authAdmin } from "../middlewares/Auth";

const router = Router();

router.post("/", authToken, authAdmin, FixtureController.newFixture);
router.get("/", authToken, authAdmin, FixtureController.getAllFixtures);
router.get("/:id", authToken, FixtureController.getFixture);
// router.put("/:id", authToken, authAdmin, FixtureController.updateFixture);
router.delete("/:id", authToken, authAdmin, FixtureController.removeFixture);


export default router;