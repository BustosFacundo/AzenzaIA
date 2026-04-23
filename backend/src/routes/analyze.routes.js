import express from "express";
import { analyzeController } from "../controllers/analyze.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
    "/analyze",
    upload.single("image"),
    analyzeController
);

export default router;