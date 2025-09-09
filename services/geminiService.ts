import { GoogleGenAI, Type } from "@google/genai";
import { Activity, ActivityType } from "../types";

// Fix: Initialize the GoogleGenAI client. Ensure API_KEY is set in your environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-2.5-flash";

const commonPromptInstructions = `
Eres un profesor de español para extranjeros creando ejercicios para un estudiante de nivel A2.
El tono debe ser amigable, educativo y claro.
Genera el contenido en español.
NO incluyas ninguna explicación introductoria o final en tu respuesta. Solo devuelve el JSON.
`;

const responseSchemaSerVsEstar = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Un título creativo para el ejercicio sobre 'ser' vs 'estar'." },
        questions: {
            type: Type.ARRAY,
            description: "Una lista de 5 a 8 preguntas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sentence: { type: Type.STRING, description: "Una frase con '___' marcando el espacio en blanco donde debe ir la forma CONJUGADA de 'ser' o 'estar'." },
                    options: { type: Type.ARRAY, description: "Una lista de 3 a 4 opciones de respuesta, incluyendo la correcta y distractores plausibles.", items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING, description: "La forma verbal CONJUGADA correcta de la lista de opciones." },
                    explanation: { type: Type.STRING, description: "Una breve explicación en español de por qué la respuesta es correcta." }
                },
                required: ["sentence", "options", "correctAnswer", "explanation"]
            }
        }
    },
    required: ["title", "questions"]
};


const responseSchemaFillInTheBlank = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Un título para el ejercicio de completar los espacios en blanco." },
        instructions: { type: Type.STRING, description: "Instrucciones claras para el estudiante." },
        questions: {
            type: Type.ARRAY,
            description: "Una lista de 5 a 8 frases.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sentence: { type: Type.STRING, description: "Una frase con '___' marcando el espacio en blanco." },
                    correctAnswer: { type: Type.STRING, description: "La palabra o palabras que completan la frase." },
                    hintInGreek: { type: Type.STRING, description: "Una pista opcional en griego para ayudar al estudiante." }
                },
                required: ["sentence", "correctAnswer"]
            }
        }
    },
    required: ["title", "instructions", "questions"]
};

const responseSchemaVocabularyMatch = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Un título para el ejercicio de vocabulario." },
        instructions: { type: Type.STRING, description: "Instrucciones claras para el estudiante." },
        items: {
            type: Type.ARRAY,
            description: "Una lista de 5 a 8 pares de palabra/definición.",
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING, description: "La palabra en español." },
                    definition: { type: Type.STRING, description: "Una definición simple en español o una traducción." }
                },
                required: ["word", "definition"]
            }
        }
    },
    required: ["title", "instructions", "items"]
};

const responseSchemaReadingComprehension = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Un título para el texto." },
        text: { type: Type.STRING, description: "Un texto corto (100-150 palabras) de nivel A2." },
        questions: {
            type: Type.ARRAY,
            description: "Una lista de 3 a 5 preguntas de opción múltiple sobre el texto.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "La pregunta sobre el texto." },
                    options: { type: Type.ARRAY, description: "Una lista de 3-4 opciones de respuesta.", items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING, description: "La opción de respuesta correcta." }
                },
                required: ["question", "options", "correctAnswer"]
            }
        }
    },
    required: ["title", "text", "questions"]
};

const responseSchemaVerbTenses = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Un título para el ejercicio de tiempos verbales." },
        instructions: { type: Type.STRING, description: "Instrucciones claras, indicando qué tiempos verbales se practicarán (ej. pretérito indefinido y pretérito imperfecto)." },
        questions: {
            type: Type.ARRAY,
            description: "Una lista de 5 a 8 frases.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sentence: { type: Type.STRING, description: "Una frase con el verbo en infinitivo entre paréntesis y un espacio en blanco. Ej: 'Ayer yo (comer) ___ paella.'" },
                    verb: { type: Type.STRING, description: "El verbo en infinitivo." },
                    greekVerb: { type: Type.STRING, description: "El infinitivo del verbo traducido al griego." },
                    tense: { type: Type.STRING, description: "El tiempo verbal a conjugar." },
                    correctAnswer: { type: Type.STRING, description: "La forma verbal conjugada correcta." }
                },
                required: ["sentence", "verb", "greekVerb", "tense", "correctAnswer"]
            }
        }
    },
    required: ["title", "instructions", "questions"]
};


const getActivityPromptAndSchema = (activityType: ActivityType): { prompt: string, schema: object } => {
    switch (activityType) {
        case ActivityType.SerVsEstar:
            return {
                prompt: "Crea un ejercicio de opción múltiple para practicar las formas conjugadas de los verbos 'ser' y 'estar'. Las frases deben tener un espacio en blanco.",
                schema: responseSchemaSerVsEstar
            };
        case ActivityType.FillInTheBlank:
            return {
                prompt: "Crea un ejercicio de completar espacios en blanco sobre preposiciones comunes (por, para, en, a, de). Para algunas preguntas, puedes incluir una pista en griego.",
                schema: responseSchemaFillInTheBlank
            };
        case ActivityType.VocabularyMatch:
            return {
                prompt: "Crea un ejercicio para emparejar vocabulario sobre comida y restaurantes.",
                schema: responseSchemaVocabularyMatch
            };
        case ActivityType.ReadingComprehension:
            return {
                prompt: "Crea un ejercicio de comprensión lectora sobre un viaje a una ciudad de habla hispana.",
                schema: responseSchemaReadingComprehension
            };
        case ActivityType.VerbTenses:
            return {
                prompt: "Crea un ejercicio para practicar la diferencia entre el pretérito indefinido y el pretérito imperfecto.",
                schema: responseSchemaVerbTenses
            };
        case ActivityType.VerbConjugation:
             return {
                prompt: "Crea un ejercicio para practicar la conjugación de verbos irregulares comunes en tiempo presente (por ejemplo: tener, ir, ser, estar).",
                schema: responseSchemaVerbTenses // Reusing the same schema as it fits perfectly
            };
        default:
            throw new Error("Unknown activity type");
    }
};

export const generateActivity = async (activityType: ActivityType): Promise<Activity> => {
    try {
        const { prompt, schema } = getActivityPromptAndSchema(activityType);

        // Fix: Call the Gemini API to generate content with a JSON schema.
        const response = await ai.models.generateContent({
            model: model,
            contents: `${commonPromptInstructions}\n${prompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        // Fix: Access the text property for the response.
        const jsonText = response.text.trim();
        const generatedExercise = JSON.parse(jsonText);

        return { type: activityType, ...generatedExercise } as Activity;

    } catch (error) {
        console.error("Error generating activity:", error);
        throw new Error("Failed to generate activity. Please try again.");
    }
};