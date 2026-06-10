import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyze.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://azenza.netlify.app",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor en ${PORT}`);
});