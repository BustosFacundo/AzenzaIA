// ===============================
// ========== PROMPT =============
// ===============================
const buildSystemPrompt = (inputs) => {
    return `Eres un auditor de marca senior. 
            
CONTEXTO DEL CLIENTE (Lo que ellos dicen ser):
1. Problema que resuelven: "${inputs.problem}"
2. Diferenciación declarada: "${inputs.diff}"
3. Público Objetivo declarado: "${inputs.target}"

TU TAREA:
Analiza la captura de pantalla del perfil de red social proporcionada.
CRUZA la información visual con el "Contexto del Cliente" de arriba. Detecta desconexiones.
Los campos de string deben ser resumidos a una frase corta que sea representativa del problema general.

ESTRUCTURA DE ANÁLISIS:
1. **Coherencia Estratégica (Perfil/Bio)**: ¿La bio comunica el problema y la diferenciación que el usuario declaró? ¿Es claro para el público objetivo mencionado?
2. **Impacto Visual (Branding)**: ¿El estilo visual atrae al público objetivo declarado? (ej. colores corporativos vs divertidos).
3. **Contenido Visible**: ¿Los posts visibles parecen resolver el problema declarado?

Formato de salida: JSON estricto.`;
};

// ===============================
// == ESTRUCTURA JSON RESPUESTA ==
// ===============================
const JSON_SCHEMA = {
    type: "OBJECT",
    properties: {
        profileAnalysis: {
            type: "OBJECT",
            properties: {
                score: { type: "NUMBER" },
                positives: { type: "STRING" },
                negatives: { type: "STRING" },
                recommendation: { type: "STRING" }
            }
        },
        visualIdentity: {
            type: "OBJECT",
            properties: {
                score: { type: "NUMBER" },
                positives: { type: "STRING" },
                negatives: { type: "STRING" },
                recommendation: { type: "STRING" }
            }
        },
        contentStrategy: {
            type: "OBJECT",
            properties: {
                score: { type: "NUMBER" },
                positives: { type: "STRING" },
                negatives: { type: "STRING" },
                recommendation: { type: "STRING" }
            }
        },
        overallSummary: {
            type: "STRING"
        }
    }
};

// ===============================
// ===== SERVICIO PRINCIPAL ======
// ===============================
export const callGemini = async (base64Image, inputs) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const systemPrompt = buildSystemPrompt(inputs);

        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: "Audita este perfil basándote en mi estrategia." },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: JSON_SCHEMA
            }
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Error en Gemini");
        }

        const data = await response.json();

        const parsed = JSON.parse(
            data.candidates[0].content.parts[0].text
        );

        return parsed;

    } catch (error) {
        throw new Error(error.message);
    }
};