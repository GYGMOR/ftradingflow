import { Router } from "express";
import { getNodes, heartbeat } from "../controllers/botNodeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateJWT, getNodes);
router.post("/heartbeat", authenticateJWT, heartbeat);

export default router;
