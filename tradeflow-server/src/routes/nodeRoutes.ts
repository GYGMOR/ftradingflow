import { Router } from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { authenticateNodeJWT } from "../middleware/nodeAuthMiddleware.js";
import { createPairingCode, enrollVerify, refreshNodeToken } from "../controllers/nodeEnrollmentController.js";
import { heartbeat, getNodes } from "../controllers/botNodeController.js";

const router = Router();

// 0. Retrieval
router.get("/", authenticateJWT, getNodes);

// 1. Enrollment (User initiated)
router.post("/enroll/code", authenticateJWT, createPairingCode);

// 2. Enrollment (Node initiated - No JWT needed initially)
router.post("/enroll/verify", enrollVerify);

// 3. Token Management (Node initiated)
router.post("/token/refresh", refreshNodeToken);

// 4. Monitoring (Node initiated - Node Auth)
router.post("/heartbeat", authenticateNodeJWT, heartbeat);

export default router;
