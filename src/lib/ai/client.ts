import "server-only";
import OpenAI from "openai";

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  throw new Error("DEEPSEEK_API_KEY is not set.");
}

// Server-only DeepSeek client configured via OpenAI SDK.
export const deepseekClient = new OpenAI({
  apiKey,
  baseURL: "https://api.deepseek.com",
});
