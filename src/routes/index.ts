import { Request, Response, Router } from "express";
import { http_responder } from "../utils/http_response";

// Init router and path
const router = Router();

router.use("/health", (req: Request, res: Response) => {
	const message = "CSTS Server is up & Running";
	return http_responder.successResponse(res, [], message);
});



// Export the base-router
export default router;
