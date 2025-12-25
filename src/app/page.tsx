import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:py-16">
        <nav className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
              EI
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Echointerview</p>
              <p className="text-sm font-semibold">AI Interview Ops</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-sm font-medium text-slate-700 sm:flex">
            <Link href="/dashboard/jobs" className="hover:text-slate-900">
              Jobs
            </Link>
            <Link href="/dashboard/interviews" className="hover:text-slate-900">
              Interviews
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link
              href="/dashboard/jobs/new"
              className="rounded-md bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:bg-slate-800"
            >
              + New Job
            </Link>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="sm:hidden rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm"
          >
            + New Job
          </Link>
        </nav>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">AI Interview Ops</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Echointerview
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Create roles, auto-generate tailored interview questions, collect candidate responses, and score them with DeepSeek.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              href="/dashboard/jobs/new"
            >
              Create a Job
            </Link>
            <Link
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
              href="/dashboard/jobs"
            >
              View Jobs
            </Link>
            <Link
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
              href="/dashboard/interviews"
            >
              View Interviews
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">01</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Create Jobs</h3>
            <p className="mt-2 text-sm text-slate-600">Add titles and descriptions; we generate structured question sets.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">02</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Interview</h3>
            <p className="mt-2 text-sm text-slate-600">Candidates answer tailored questions with a focused, simple UI.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">03</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">AI Scoring</h3>
            <p className="mt-2 text-sm text-slate-600">DeepSeek grades responses, aggregates scores, and surfaces feedback.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
