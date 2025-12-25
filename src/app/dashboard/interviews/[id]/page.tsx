import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type InterviewWithResponses = {
  id: string;
  status: string;
  overall_score: number | null;
  responses: {
    id: string;
    response_text: string | null;
    ai_feedback: { score?: number; feedback?: string } | null;
    questions: { id: string; text: string; difficulty: string | null } | null;
  }[];
};

export default async function InterviewResultsPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("interviews")
    .select(
      `id, status, overall_score, responses:responses ( id, response_text, ai_feedback, questions:question_id ( id, text, difficulty ) )`,
    )
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    console.error("interview results fetch failed", error);
    throw new Error("Failed to load interview");
  }

  if (!data) {
    notFound();
  }

  const interview = data as InterviewWithResponses;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white shadow-md">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300">Overall Score</p>
            <h1 className="text-4xl font-semibold leading-tight">Interview {interview.id}</h1>
            <p className="text-sm text-slate-200">Status: {interview.status}</p>
          </div>
          {interview.overall_score !== null ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-3xl font-bold">
              {interview.overall_score}
            </div>
          ) : null}
        </div>
      </header>

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Responses</h2>
        <div className="space-y-3">
          {interview.responses.map((res, idx) => (
            <article key={res.id} className="rounded-md border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Question {idx + 1}</p>
              <p className="text-base font-semibold text-slate-900">{res.questions?.text ?? "Unknown question"}</p>
              <p className="text-xs text-slate-500">Difficulty: {res.questions?.difficulty ?? "n/a"}</p>
              <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{res.response_text ?? "(no answer)"}</p>
              {res.ai_feedback ? (
                <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-800">
                  <p className="font-semibold">AI Feedback</p>
                  <p>Score: {res.ai_feedback.score ?? "n/a"}</p>
                  <p className="text-slate-700">{res.ai_feedback.feedback ?? ""}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
