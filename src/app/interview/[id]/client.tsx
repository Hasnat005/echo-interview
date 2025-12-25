"use client";

import { useEffect } from "react";
import { useInterviewStore } from "@/stores/interview-store";
import type { InterviewWithQuestions } from "./page";

type Props = {
  interview: InterviewWithQuestions;
  questions: { id: string; text: string; difficulty: string | null }[];
};

export default function InterviewClient({ interview, questions }: Props) {
  const setQuestions = useInterviewStore((state) => state.setQuestions);
  const currentQuestionIndex = useInterviewStore((state) => state.currentQuestionIndex);
  const nextQuestion = useInterviewStore((state) => state.nextQuestion);
  const prevQuestion = useInterviewStore((state) => state.prevQuestion);
  const responses = useInterviewStore((state) => state.responses);
  const setResponse = useInterviewStore((state) => state.setResponse);

  useEffect(() => {
    setQuestions(questions.map((q) => ({ question: q.text, difficulty: q.difficulty ?? undefined })));
  }, [questions, setQuestions]);

  const current = questions[currentQuestionIndex];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 text-slate-900">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Interview</p>
        <h1 className="text-2xl font-semibold">Interview {interview.id}</h1>
        <p className="text-sm text-slate-600">Status: {interview.status}</p>
      </header>

      {current ? (
        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700">Question {currentQuestionIndex + 1}</p>
          <p className="text-base text-slate-900">{current.text}</p>
          <p className="text-xs text-slate-500">Difficulty: {current.difficulty ?? "n/a"}</p>
          <textarea
            className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
            rows={4}
            value={responses[current.id] ?? ""}
            onChange={(e) => setResponse(current.id, e.target.value)}
            placeholder="Your response..."
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevQuestion}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              disabled={currentQuestionIndex >= questions.length - 1}
            >
              Next
            </button>
          </div>
        </section>
      ) : (
        <p className="text-sm text-slate-600">No questions available.</p>
      )}
    </main>
  );
}
