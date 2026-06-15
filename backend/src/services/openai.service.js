import OpenAI from "openai";

// ===============================
// ========== CLIENTE ============
// ===============================

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

CRUZA la información visual con el contexto del cliente y detecta desconexiones.

Los campos de texto deben ser resumidos en una frase corta representativa.

ESTRUCTURA DEL ANÁLISIS

1. Coherencia Estratégica (Perfil/Bio)
- ¿La bio comunica el problema?
- ¿Comunica la diferenciación?
- ¿Es clara para el público objetivo?

2. Impacto Visual (Branding)
- ¿El estilo visual atrae al público objetivo?

3. Contenido Visible
- ¿Los posts visibles ayudan a resolver el problema declarado?

IMPORTANTE:
Devuelve EXCLUSIVAMENTE un JSON válido con la siguiente estructura:

{
  "profileAnalysis": {
    "score": number,
    "positives": string,
    "negatives": string,
    "recommendation": string
  },
  "visualIdentity": {
    "score": number,
    "positives": string,
    "negatives": string,
    "recommendation": string
  },
  "contentStrategy": {
    "score": number,
    "positives": string,
    "negatives": string,
    "recommendation": string
  },
  "overallSummary": string
}

No agregues texto fuera del JSON.`;
};

// ===============================
// ===== SERVICIO PRINCIPAL ======
// ===============================

export const callGPT = async (base64Image, inputs) => {

    try {
        const response = await client.responses.create({
            model: "gpt-5-mini",
            input: [
                {
                    role: "system",
                    content: buildSystemPrompt(inputs)
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: "Audita este perfil basándote en mi estrategia."
                        },
                        {
                            type: "input_image",
                            image_url: `data:image/jpeg;base64,${base64Image}`
                        }
                    ]
                }
            ],

            text: {
                format: {
                    type: "json_object"
                }
            }

        });

        return JSON.parse(response.output_text);

    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error(error.message);
    }

};