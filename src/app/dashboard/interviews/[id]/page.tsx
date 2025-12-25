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
    notFound();
  }

  if (!data) {
    notFound();
  }

  const interview: InterviewWithResponses = {
    id: String(data.id),
    status: String(data.status),
    overall_score: data.overall_score ?? null,
    responses: (data.responses ?? []).map((res: unknown) => {
      const r = res as {
        id?: unknown;
        response_text?: unknown;
        ai_feedback?: unknown;
        questions?: { id?: unknown; text?: unknown; difficulty?: unknown } | null;
      };

      return {
        id: String(r.id),
        response_text: (r.response_text as string | null | undefined) ?? null,
        ai_feedback: (r.ai_feedback as { score?: number; feedback?: string } | null | undefined) ?? null,
        questions: r.questions
          ? {
              id: String(r.questions.id),
              text: String(r.questions.text),
              difficulty: (r.questions.difficulty as string | null | undefined) ?? null,
            }
          : null,
      };
    }),
  };

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
        <div className="grid gap-4 md:grid-cols-2">
          {interview.responses.map((res, idx) => (
            <article key={res.id} className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/40 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Question {idx + 1}</p>
                  <p className="text-base font-semibold text-slate-900">{res.questions?.text ?? "Unknown question"}</p>
                  <p className="text-xs text-slate-500">Difficulty: {res.questions?.difficulty ?? "n/a"}</p>
                </div>
                {res.ai_feedback?.score !== undefined ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                    {res.ai_feedback.score}
                  </div>
                ) : null}
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800 whitespace-pre-wrap">
                {res.response_text ?? "(no answer)"}
              </div>

              {res.ai_feedback ? (
                <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800">
                  <p className="font-semibold">AI Feedback</p>
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
