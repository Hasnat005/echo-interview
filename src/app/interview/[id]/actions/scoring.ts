"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deepseekClient } from "@/lib/ai/client";

const SYSTEM_PROMPT =
  "You are a senior engineer. Grade this answer on a scale of 1-100 and provide brief feedback. Return ONLY JSON. Schema: { score: number, feedback: string }.";

type ResponseRow = {
  id: string;
  response_text: string | null;
  question_id: string;
  questions: { id: string; text: string; difficulty: string | null } | null;
};

export async function scoreInterview(interviewId: string) {
  if (!interviewId) {
    throw new Error("Interview id is required");
  }

  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("responses")
      .select(`id, response_text, question_id, questions:question_id ( id, text, difficulty )`)
      .eq("interview_id", interviewId);

    if (error) {
      console.error("scoreInterview: fetch failed", error);
      throw new Error("Failed to load interview responses");
    }

    if (!data) {
      throw new Error("No responses found for interview");
    }

    const scored = [] as { questionId: string; score: number; feedback: string }[];

    for (const row of data as ResponseRow[]) {
      const question = row.questions?.text;
      if (!question) {
        throw new Error(`Missing question text for question ${row.question_id}`);
      }

      const userPrompt = `Question: ${question}\n Answer: ${row.response_text ?? ""}`;

      const completion = await deepseekClient.chat.completions.create({
        model: "deepseek-chat",
        temperature: 0,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? "";

      let parsed: unknown;
      try {
        const match = raw.match(/\{[\s\S]*\}/);
        const jsonText = match?.[0] ?? raw;
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("scoreInterview: parse failed", { raw, parseError });
        throw new Error("Failed to parse DeepSeek score response");
      }

      const score = (parsed as { score?: unknown }).score;
      const feedback = (parsed as { feedback?: unknown }).feedback;

      if (typeof score !== "number" || typeof feedback !== "string") {
        console.error("scoreInterview: invalid schema", { parsed });
        throw new Error("DeepSeek score response missing required fields");
      }

      scored.push({ questionId: row.question_id, score, feedback });
    }

    // TODO: persist `scored` results to the database and set overall score
  } catch (error) {
    console.error("scoreInterview failed", error);
    throw new Error("Failed to score interview");
  }
}
