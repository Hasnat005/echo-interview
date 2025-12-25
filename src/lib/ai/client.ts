import "server-only";
import OpenAI from "openai";

const apiKey = process.env.DEEPSEEK_API_KEY;

// Server-only DeepSeek client configured via OpenAI SDK. Null when no key is provided.
export const deepseekClient = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    })
  : null;
