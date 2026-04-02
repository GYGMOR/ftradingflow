import { Router } from "express";
import { getLayouts, saveLayout } from "../controllers/layoutController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateJWT, getLayouts);
router.post("/", authenticateJWT, saveLayout);

export default router;
