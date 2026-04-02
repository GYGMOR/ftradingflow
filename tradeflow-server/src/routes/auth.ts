import { Router } from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

// Local Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// SSO
router.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }));
router.get("/google/callback", authController.googleCallback);

router.get("/microsoft", passport.authenticate("microsoft", { session: false, scope: ["user.read"] }));
router.get("/microsoft/callback", authController.microsoftCallback);

// Profile
router.get("/me", authenticateJWT, authController.getProfile);

export default router;
