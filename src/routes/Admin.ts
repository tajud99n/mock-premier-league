import { Router } from "express";
import * as AdminController from "../controllers/AdminController";
import * as AuthController from "../controllers/AuthController";


const router = Router();

router.post("/register", AdminController.newAdmin);
router.post("/login", AuthController.loginAdmin);

export default router;
