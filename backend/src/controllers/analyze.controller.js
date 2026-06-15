import { toBase64 } from "../utils/image.utils.js";
import { callGPT } from "../services/openai.service.js";

export const analyzeController = async (req, res) => {
    try {
        const { problem, diff, target } = req.body;

        if (!problem || !diff || !target) {
            return res.status(400).json({ error: "Faltan campos de texto" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Falta imagen" });
        }

        const base64Image = toBase64(req.file);

        const result = await callGPT(base64Image, {
            problem,
            diff,
            target
        });

        res.json(result);

    } catch (error) {
        // Error de limite diario
        if (error.status === 429) {
            return res.status(429).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};