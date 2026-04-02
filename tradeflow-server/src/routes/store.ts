import { Router } from "express";
import { checkout } from "../controllers/storeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/checkout", authenticateJWT, checkout);

export default router;
