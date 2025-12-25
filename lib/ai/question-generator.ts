import "server-only";
import { deepseekClient } from "@/lib/ai/client";

// TODO: Call DeepSeek to generate interview questions based on a job description.
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
  const parsed = JSON.parse(content) as { question: string; difficulty: string }[];
  return parsed;
}
