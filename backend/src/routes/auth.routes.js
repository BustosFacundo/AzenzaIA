import express from "express";
import {
    register,
    login,
    logout,
    me,
    updateProfile,
    updatePassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authRateLimitMiddleware } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

// Públicas
router.post("/register", authRateLimitMiddleware, register);
router.post("/login", authRateLimitMiddleware, login);
router.post("/logout", logout);
router.get("/me", me);

// Requieren sesión
router.patch("/me", requireAuth, updateProfile);
router.patch("/password", requireAuth, updatePassword);

export default router;
