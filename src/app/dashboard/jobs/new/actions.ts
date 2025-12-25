"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/ai/question-generator";

export async function createJob(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("createJob: unable to fetch user", userError);
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    console.error("createJob: unable to resolve organization", profileError);
    throw new Error("Organization is required to create a job");
  }

  const { data: jobRow, error: insertError } = await supabase
    .from("jobs")
    .insert({
      title,
      description,
      organization_id: profile.organization_id,
    })
    .select("id")
    .single();

  if (insertError || !jobRow?.id) {
    console.error("createJob: insert failed", insertError);
    throw new Error("Failed to create job");
  }

  const questions = await generateQuestions(description);

  const { error: questionsError } = await supabase.from("questions").insert(
    questions.map((q) => ({
      job_id: jobRow.id,
      text: q.question,
      difficulty: q.difficulty,
    })),
  );

  if (questionsError) {
    console.error("createJob: inserting questions failed", questionsError);
    // Optional best-effort cleanup to avoid orphaned job
    await supabase.from("jobs").delete().eq("id", jobRow.id);
    throw new Error("Failed to create job questions");
  }
}
