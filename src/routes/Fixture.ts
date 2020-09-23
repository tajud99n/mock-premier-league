import { Router } from "express";
import * as FixtureController from "../controllers/FixtureController";
import { authToken, authAdmin } from "../middlewares/Auth";

const router = Router();

router.post("/", authToken, authAdmin, FixtureController.newFixture);
router.get("/", authToken, FixtureController.getAllFixtures);
router.get("/link/:id", authToken, FixtureController.getFixture);
router.get("/:id", authToken, authAdmin, FixtureController.getFixtureAdmin);
router.put("/:id", authToken, authAdmin, FixtureController.updateFixture);
router.delete("/:id", authToken, authAdmin, FixtureController.removeFixture);


export default router;