import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

export async function generateContent(prompt: string, systemPrompt?: string) {
    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
        systemInstruction: systemPrompt,
    });

    return result.response.text();
}

export async function generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const text = await generateContent(prompt + "\n\nIMPORTANT: Return ONLY a valid JSON object. No other text.", systemPrompt);
    try {
        // Basic cleanup of potential markdown blocks
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error("Failed to parse AI JSON response:", text);
        throw new Error("AI returned invalid JSON format.");
    }
}
