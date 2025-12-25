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

  const { error: insertError } = await supabase.from("jobs").insert({
    title,
    description,
    organization_id: profile.organization_id,
  });

  if (insertError) {
    console.error("createJob: insert failed", insertError);
    throw new Error("Failed to create job");
  }

  // Trigger question generation based on the job description.
  await generateQuestions(description);
}
