import express from "express";
import { analyzeController } from "../controllers/analyze.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/analyze",
    requireAuth,
    rateLimitMiddleware,
    upload.single("image"),
    analyzeController
);

export default router;
