"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitInterview(interviewId: string) {
  if (!interviewId) {
    throw new Error("Interview id is required");
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "completed" })
    .eq("id", interviewId);

  if (error) {
    console.error("submitInterview: update failed", error);
    throw new Error("Failed to submit interview");
  }

  redirect("/dashboard/jobs");
}
