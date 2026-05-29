import express from "express";
import { analyzeController } from "../controllers/analyze.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post(
    "/analyze",
    rateLimitMiddleware,
    upload.single("image"),
    analyzeController
);

export default router;