import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = Router();

// All routes here are protected by JWT and Admin Role
router.use(authenticateJWT, isAdmin);

router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.get("/stats", adminController.getStats);
router.get("/audit-logs", adminController.getAuditLogs);

export default router;
