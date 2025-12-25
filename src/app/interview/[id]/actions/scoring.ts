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

  const client = deepseekClient;
  if (!client) {
    throw new Error("AI scoring is unavailable: missing DeepSeek API key");
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

    const scored = [] as { responseId: string; questionId: string; score: number; feedback: string }[];

    const rows: ResponseRow[] = (data ?? []).map((row: unknown) => {
      const r = row as {
        id?: unknown;
        response_text?: unknown;
        question_id?: unknown;
        questions?: { id?: unknown; text?: unknown; difficulty?: unknown } | null;
      };

      return {
        id: String(r.id),
        response_text: (r.response_text as string | null | undefined) ?? null,
        question_id: String(r.question_id),
        questions: r.questions
          ? {
              id: String(r.questions.id),
              text: String(r.questions.text),
              difficulty: (r.questions.difficulty as string | null | undefined) ?? null,
            }
          : null,
      };
    });

    for (const row of rows) {
      const question = row.questions?.text;
      if (!question) {
        throw new Error(`Missing question text for question ${row.question_id}`);
      }

      const userPrompt = `Question: ${question}\n Answer: ${row.response_text ?? ""}`;

      const completion = await client.chat.completions.create({
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

      scored.push({ responseId: row.id, questionId: row.question_id, score, feedback });
    }

    // Update ai_feedback for each response row
    const updates = scored.map((item) =>
      supabase
        .from("responses")
        .update({ ai_feedback: { score: item.score, feedback: item.feedback } })
        .eq("id", item.responseId),
    );

    const results = await Promise.all(updates);

    const updateError = results.find((res) => res.error)?.error;
    if (updateError) {
      console.error("scoreInterview: failed to persist ai_feedback", updateError);
      throw new Error("Failed to persist interview scores");
    }

    if (scored.length === 0) {
      throw new Error("No scores computed for interview");
    }

    const total = scored.reduce((sum, item) => sum + item.score, 0);
    const averageScore = Math.round(total / scored.length);

    const { error: interviewUpdateError } = await supabase
      .from("interviews")
      .update({ overall_score: averageScore, status: "completed" })
      .eq("id", interviewId);

    if (interviewUpdateError) {
      console.error("scoreInterview: failed to update interview", interviewUpdateError);
      throw new Error("Failed to update interview score");
    }
  } catch (error) {
    console.error("scoreInterview failed", error);
    throw new Error("Failed to score interview");
  }
}
