"use server";

export async function createJob(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  // TODO: Persist job to database
  console.log("createJob action", { title, description });
}
