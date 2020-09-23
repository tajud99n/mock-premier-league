import { Router } from "express";
import * as AdminController from "../controllers/AdminController";
import * as AuthController from "../controllers/AuthController";
import * as FixtureController from "../controllers/FixtureController";
import { authToken, authAdmin } from "../middlewares/Auth";

const router = Router();

router.post("/register", AdminController.newAdmin);
router.post("/login", AuthController.loginAdmin);
router.get("/fixture/:id", authToken, authAdmin, FixtureController.getFixtureAdmin);

export default router;
