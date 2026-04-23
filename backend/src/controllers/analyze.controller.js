import { toBase64 } from "../utils/image.utils.js";
import { callGemini } from "../services/gemini.service.js";

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

        const result = await callGemini(base64Image, {
            problem,
            diff,
            target
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};