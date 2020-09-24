import { Router } from "express";
import * as FixtureController from "../controllers/FixtureController";
import { authToken, authAdmin } from "../middlewares/Auth";
import { cachedFixture, cachedFixtures } from "../middlewares/Cache";

const router = Router();

router.post("/", authToken, authAdmin, FixtureController.newFixture);
router.get("/", authToken, cachedFixtures, FixtureController.getAllFixtures);
router.get("/link/:id", authToken, cachedFixture, FixtureController.getFixture);
router.get("/:id", authToken, authAdmin, cachedFixture, FixtureController.getFixtureAdmin);
router.put("/:id", authToken, authAdmin, FixtureController.updateFixture);
router.delete("/:id", authToken, authAdmin, FixtureController.removeFixture);


export default router;