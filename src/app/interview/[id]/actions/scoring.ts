"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function scoreInterview(interviewId: string) {
  if (!interviewId) {
    throw new Error("Interview id is required");
  }

  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("responses")
      .select(`id, response_text, question_id, questions:question_id ( id, text, difficulty )`)
      .eq("interview_id", interviewId);

    if (error) {
      console.error("scoreInterview: fetch failed", error);
      throw new Error("Failed to load interview responses");
    }

    if (!data) {
      throw new Error("No responses found for interview");
    }

    // TODO: implement interview scoring logic using questions/responses in `data`
  } catch (error) {
    console.error("scoreInterview failed", error);
    throw new Error("Failed to score interview");
  }
}
