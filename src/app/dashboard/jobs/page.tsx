import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function JobsIndexPage() {
  const useService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabase = useService ? createSupabaseServiceClient() : createSupabaseServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, description")
    .order("id", { ascending: false });

  if (error) {
    console.error("jobs list fetch failed", error);
  }

  const jobs = data ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Jobs</p>
          <h1 className="text-2xl font-semibold">Open Roles</h1>
          <p className="text-sm text-slate-600">Create roles and manage interview question sets.</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          + New Job
        </Link>
      </header>

      {jobs.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">No jobs yet. Create your first role to start interviews.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">Job</p>
              <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-slate-600">{job.description}</p>
              <p className="mt-3 text-xs text-slate-500">Job ID: {job.id}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
