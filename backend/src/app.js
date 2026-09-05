// Carga las variables de entorno ANTES que cualquier otro import,
// porque varios módulos (OpenAI, sesiones, Prisma) leen process.env
// en el momento en que se importan.
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { sessionMiddleware } from "./config/session.js";

const app = express();

// Necesario en Render/Railway: el servidor está detrás de un proxy y sin esto
// las cookies "secure" no se envían y la IP real se pierde.
app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://azenza.netlify.app",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor en ${PORT}`);
});
