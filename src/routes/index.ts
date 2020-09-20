import { Request, Response, Router } from "express";
import { http_responder } from "../utils/http_response";
import { loginUser } from "../controllers/AuthController";
import { newUser } from "../controllers/UserController";

// Init router and path
const router = Router();

router.use("/health", (req: Request, res: Response) => {
	const message = "MPL Server is up & Running";
	return http_responder.successResponse(res, [], message);
});

// Add sub-routes

router.post("/login", loginUser);
router.post("/register", newUser);

// Export the base-router
export default router;
