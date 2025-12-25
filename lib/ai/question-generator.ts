import "server-only";
import { deepseekClient } from "@/lib/ai/client";

// TODO: Call DeepSeek to generate interview questions based on a job description.
export async function generateQuestions(jobDescription: string): Promise<
  { question: string; difficulty: string }[]
> {
  // Placeholder implementation
  return [];
}
