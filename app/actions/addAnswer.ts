"use server";

import { db } from "@/db";
import { post, subject } from "@/db/schema";
import { newValue } from "@/app/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addAnswer(formData: FormData) {
  const subjectId = formData.get("subjectId");
  const newSubjectName = formData.get("newSubjectName");
  const week = formData.get("week");
  const adminPassword = formData.get("adminPassword");

  // Simple admin password check (replace with a more secure method in production)
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    throw new Error("Unauthorized");
  }
  const content = formData.get("content");

  if (typeof week !== "string" || typeof content !== "string") {
    throw new Error("Invalid form data");
  }

  let finalSubjectId: number;

  if (subjectId === newValue) {
    if (typeof newSubjectName !== "string") {
      throw new Error("Invalid form data for new subject");
    }
    // Insert new subject and get its ID
    const result = await db
      .insert(subject)
      .values({ name: newSubjectName })
      .returning({ id: subject.id });
    finalSubjectId = result[0].id;
  } else {
    console.log("Selected subject ID:", subjectId);
    finalSubjectId = parseInt(subjectId as string);
  }

  // Insert the answer with the final subject ID
  await db.insert(post).values({
    subjectId: finalSubjectId,
    week: parseInt(week),
    content,
  });

  revalidatePath("/");
  redirect("/");
}
