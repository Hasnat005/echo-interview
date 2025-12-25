import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function InterviewsIndexPage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("id, status, overall_score, job_id, candidate_id");

  if (error) {
    console.error("interviews list fetch failed", error);
  }

  const interviews = data ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Interviews</p>
        <h1 className="text-2xl font-semibold">Interview Results</h1>
        <p className="text-sm text-slate-600">Select an interview to view responses and AI scores.</p>
      </header>

      {interviews.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">No interviews yet. Create a job and start an interview.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {interviews.map((interview) => (
            <Link
              key={interview.id}
              href={`/dashboard/interviews/${interview.id}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Interview</p>
                  <p className="text-lg font-semibold text-slate-900">{interview.id}</p>
                  <p className="text-xs text-slate-500">Status: {interview.status}</p>
                </div>
                {interview.overall_score !== null ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                    {interview.overall_score}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">Not scored</div>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">Job: {interview.job_id ?? "n/a"}</p>
              <p className="text-xs text-slate-500">Candidate: {interview.candidate_id ?? "n/a"}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
