import "server-only";
import { deepseekClient } from "@/lib/ai/client";

function stripCodeFences(payload: string): string {
  const fence = /```[a-zA-Z]*\n([\s\S]*?)```/m;
  const match = payload.match(fence);
  if (match?.[1]) {
    return match[1].trim();
  }
  return payload;
}

/**
 * Server-only helper to generate interview questions via DeepSeek chat model.
 * Expects the model to return a strict JSON array of { question, difficulty } objects.
 * Throws on invalid or insufficient responses.
 */
export async function generateQuestions(jobDescription: string): Promise<
  { question: string; difficulty: string }[]
> {
  const response = await deepseekClient.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: `Generate interview questions as JSON array for this job: ${jobDescription}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";

  try {
    const cleanedContent = stripCodeFences(content);
    const match = cleanedContent.match(/[\[\s\S]*\]/);
    const jsonText = match?.[0] ?? cleanedContent;
    const parsed = JSON.parse(jsonText) as { question: string; difficulty: string }[];

    const cleaned = Array.isArray(parsed)
      ? parsed
          .filter(
            (item) =>
              typeof item?.question === "string" && item.question.trim().length > 0 && typeof item?.difficulty === "string",
          )
          .map((item) => ({
            question: item.question.trim(),
            difficulty: item.difficulty.toLowerCase(),
          }))
      : [];

    if (cleaned.length < 3) {
      throw new Error("Insufficient valid questions from DeepSeek");
    }

    return cleaned;
  } catch (error) {
    console.error("Failed to parse DeepSeek JSON response", { error, content });
    throw new Error("Failed to parse DeepSeek JSON response");
  }
}
