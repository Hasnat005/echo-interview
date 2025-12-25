"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

export default function NewJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);

    if (!title.trim() || !description.trim()) {
      setErrors("Title and description are required.");
      return;
    }

    // TODO: integrate with backend to persist job
    console.log({ title: title.trim(), description: description.trim() });
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-12 text-slate-900">
      <div className="w-full max-w-xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Jobs</p>
          <h1 className="text-3xl font-semibold">Create a Job</h1>
          <p className="text-sm text-slate-600">Provide a clear title and concise description.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={cn(
                "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
                "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100",
              )}
              placeholder="Senior Backend Engineer"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className={cn(
                "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
                "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100",
              )}
              placeholder="Describe the role, expectations, and requirements."
            />
          </div>

          {errors ? <p className="text-sm text-red-600">{errors}</p> : null}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Create Job
          </button>
        </form>
      </div>
    </main>
  );
}
