const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const categorizeExpense = async (description, amount) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Given this transaction description: '${description}' costing ${amount}, which category matches best?. Respond with exactly one word and nothing else.`,
        });
        return response.text.trim().toLowerCase();
    } catch (err) {
        console.error("Gemini AI categorization failed, fallback to misc.", err);
        return "miscellaneous";
    }
};

const generateFinancialInsight = async (simplifiedExpenses) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are an expert financial advisor. Here is the recent expense history for this user: ${JSON.stringify(simplifiedExpenses)}. Provide a very short 2-3 sentence personalized insight or tip to help them improve their financial habits. Do not use markdown.`
        });
        return response.text.trim();
    } catch (err) {
        console.error("Gemini AI insight generation failed", err);
        return "AI is participating in terminator tournament, check back later!";
    }
};

module.exports = { categorizeExpense, generateFinancialInsight };
