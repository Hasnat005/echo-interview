"use server";

import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/ai/question-generator";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const useService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabase = useService ? createSupabaseServiceClient() : createSupabaseServerClient();

  let organizationId: string | null = null;

  if (useService) {
    // Service role: fallback to the first organization or create a default one if missing
    const { data: orgs, error: orgError } = await supabase.from("organizations").select("id").limit(1);
    if (orgError) {
      console.error("createJob: fetch organizations failed", orgError);
      throw new Error("Failed to resolve organization");
    }

    if (orgs && orgs.length > 0) {
      organizationId = orgs[0].id;
    } else {
      const { data: newOrg, error: insertOrgError } = await supabase
        .from("organizations")
        .insert({ name: "Default Org" })
        .select("id")
        .single();
      if (insertOrgError || !newOrg?.id) {
        console.error("createJob: create default org failed", insertOrgError);
        throw new Error("Failed to create default organization");
      }
      organizationId = newOrg.id;
    }
  } else {
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

    organizationId = profile.organization_id;
  }

  const { data: jobRow, error: insertError } = await supabase
    .from("jobs")
    .insert({
      title,
      description,
      organization_id: organizationId,
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

  redirect("/dashboard/jobs");
}
