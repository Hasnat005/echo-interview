import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import InterviewClient from "./client";

export type InterviewWithQuestions = {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  overall_score: number | null;
  questions: { id: string; text: string; difficulty: string | null }[];
};

export default async function InterviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("id, job_id, candidate_id, status, overall_score, questions:questions(id, text, difficulty)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const interview: InterviewWithQuestions = {
    id: data.id,
    job_id: data.job_id,
    candidate_id: data.candidate_id,
    status: data.status,
    overall_score: data.overall_score,
    questions: data.questions ?? [],
  };

  return <InterviewClient interview={interview} questions={interview.questions} />;
}
