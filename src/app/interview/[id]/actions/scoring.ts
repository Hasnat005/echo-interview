"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function scoreInterview(interviewId: string) {
  if (!interviewId) {
    throw new Error("Interview id is required");
  }

  const supabase = createSupabaseServerClient();

  try {
    // TODO: implement interview scoring logic using supabase client
  } catch (error) {
    console.error("scoreInterview failed", error);
    throw new Error("Failed to score interview");
  }
}
