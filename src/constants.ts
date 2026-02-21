import { Type } from "@google/genai";

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "Categorize the overall sentiment as 'Positive', 'Negative', 'Neutral', or 'Mixed'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score from 0.0 to 1.0.",
    },
    top_themes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific features mentioned (e.g., Battery Life, Durability, Price).",
    },
    tone: {
      type: Type.STRING,
      description: "Underlying emotions (e.g., Frustration, Satisfaction, Disappointment).",
    },
    is_sarcastic: {
      type: Type.BOOLEAN,
      description: "Identify if the user is being sarcastic.",
    },
    summary: {
      type: Type.STRING,
      description: "One sentence summary of the reviewer's main point.",
    },
  },
  required: ["sentiment", "confidence", "top_themes", "tone", "is_sarcastic", "summary"],
};

export const SYSTEM_INSTRUCTION = `Act as an expert E-commerce Sentiment Analyst. Your task is to analyze Amazon product reviews and provide a structured JSON output for each.

### Goals:
1. **Sentiment Classification**: Categorize the overall sentiment as "Positive", "Negative", "Neutral", or "Mixed".
2. **Confidence Score**: Provide a score from 0.0 to 1.0.
3. **Key Themes**: Identify specific features mentioned (e.g., Battery Life, Durability, Price).
4. **Emotional Tone**: Detect underlying emotions (e.g., Frustration, Satisfaction, Disappointment).
5. **Sarcasm Detection**: Identify if the user is being sarcastic (True/False).

### Response Format (JSON):
{
  "sentiment": "",
  "confidence": 0.0,
  "top_themes": [],
  "tone": "",
  "is_sarcastic": boolean,
  "summary": "One sentence summary of the reviewer's main point."
}`;
