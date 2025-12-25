import Link from "next/link";

export default function DashboardIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">Dashboard</p>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-600">Jump into jobs or review interviews.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/jobs"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">Roles</p>
          <h2 className="text-lg font-semibold text-slate-900">Manage Jobs</h2>
          <p className="mt-2 text-sm text-slate-600">Create roles and generate interview question sets.</p>
        </Link>

        <Link
          href="/dashboard/interviews"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">Interviews</p>
          <h2 className="text-lg font-semibold text-slate-900">Review Interviews</h2>
          <p className="mt-2 text-sm text-slate-600">Browse interviews, responses, and AI scores.</p>
        </Link>
      </div>
    </main>
  );
}
