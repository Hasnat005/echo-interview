import "server-only";
import { deepseekClient } from "@/lib/ai/client";

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
    const match = content.match(/[\[\s\S]*\]/);
    const jsonText = match?.[0] ?? content;
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
