// FIX: Import correct classes from @google/genai
import { GoogleGenAI, Type } from "@google/genai";
import { FillBlankQuestion, SerEstarQuestion, VocabularyPair, ReadingComprehensionContent, VerbTenseQuestion } from '../types';

// FIX: Initialize GoogleGenAI with a named apiKey parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// FIX: Use the recommended model for general text tasks
const model = 'gemini-2.5-flash';

/**
 * Parses the JSON string from the Gemini API response.
 * It handles responses that might be wrapped in markdown ```json ... ```.
 * @param jsonString The raw string from the API response.
 * @returns The parsed JSON object.
 */
const parseJsonResponse = <T>(jsonString: string): T => {
    try {
        const cleanedJsonString = jsonString.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(cleanedJsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString, e);
        if (jsonString.toLowerCase().includes("error") || jsonString.toLowerCase().includes("unable to generate")) {
            throw new Error(`API returned an error message: ${jsonString}`);
        }
        throw new Error("Received an invalid JSON response from the API.");
    }
};

export const generateFillInTheBlankQuestions = async (): Promise<FillBlankQuestion[]> => {
    const prompt = `Generate 5 fill-in-the-blank questions for a Spanish A2 level student. For each question, provide the sentence in two parts, the correct answer to fill the blank, and a hint. The answer should be a single word.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sentence_start: { type: Type.STRING, description: "The part of the sentence before the blank." },
                        sentence_end: { type: Type.STRING, description: "The part of the sentence after the blank." },
                        correct_answer: { type: Type.STRING, description: "The word that correctly fills the blank." },
                        hint: { type: Type.STRING, description: "A hint for the correct answer, like the verb in infinitive." },
                    },
                    required: ["sentence_start", "sentence_end", "correct_answer", "hint"],
                },
            },
        },
    });

    // FIX: Extract text from response using the .text property
    const jsonString = response.text;
    return parseJsonResponse<FillBlankQuestion[]>(jsonString);
};

export const generateSerVsEstarQuestions = async (): Promise<SerEstarQuestion[]> => {
    const prompt = `Generate 5 multiple-choice questions for a Spanish A2 level student to practice the difference between "ser" and "estar". Each question should be a sentence with a blank. Provide the sentence with "__" for the blank, the correct option ('ser' or 'estar'), the correct conjugation of the verb for the blank, and a brief explanation of why it's correct. The options should always be just 'ser' and 'estar'.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sentence: { type: Type.STRING },
                        correct_option: { type: Type.STRING },
                        correct_conjugation: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ["sentence", "correct_option", "correct_conjugation", "explanation"],
                },
            },
        },
    });
    
    const jsonString = response.text;
    const questions = parseJsonResponse<Omit<SerEstarQuestion, 'options'>[]>(jsonString);
    // The component expects options to be present, so we add them here.
    return questions.map(q => ({ ...q, options: ['ser', 'estar'] }));
};

export const generateVocabularyPairs = async (): Promise<VocabularyPair[]> => {
    const prompt = `Generate 6 vocabulary pairs for a Spanish A2 level student. Each pair should contain a common Spanish word and its translation in Modern Greek.`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        spanish_word: { type: Type.STRING },
                        greek_translation: { type: Type.STRING },
                    },
                    required: ["spanish_word", "greek_translation"],
                },
            },
        },
    });
    
    const jsonString = response.text;
    return parseJsonResponse<VocabularyPair[]>(jsonString);
};

export const generateReadingComprehensionExercise = async (): Promise<ReadingComprehensionContent> => {
    const prompt = `Generate a short reading comprehension exercise for a Spanish A2 level student. The exercise should include a short text (about 50-70 words) and 3 multiple-choice questions about the text. Each question should have 4 options and a correct answer.`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                },
                                correct_answer: { type: Type.STRING },
                            },
                            required: ["question", "options", "correct_answer"],
                        },
                    },
                },
                required: ["text", "questions"],
            },
        },
    });
    
    const jsonString = response.text;
    return parseJsonResponse<ReadingComprehensionContent>(jsonString);
};


export const generateVerbTenseQuestions = async (): Promise<VerbTenseQuestion[]> => {
    const prompt = `Generate 5 multiple-choice questions for a Spanish A2 student to practice verb tenses (presente, pretérito, futuro). Each question should be a sentence with a blank where a verb should go. Provide the start and end of the sentence, the infinitive verb, the tense to be used, 4 options (conjugated verbs), the correct answer, and a brief explanation.`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sentence_start: { type: Type.STRING },
                        verb: { type: Type.STRING },
                        sentence_end: { type: Type.STRING },
                        tense: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correct_answer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ["sentence_start", "verb", "sentence_end", "tense", "options", "correct_answer", "explanation"],
                },
            },
        },
    });
    
    const jsonString = response.text;
    return parseJsonResponse<VerbTenseQuestion[]>(jsonString);
};
