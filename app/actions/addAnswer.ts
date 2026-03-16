"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { post, subject } from "@/db/schema";
import { newValue } from "@/app/lib/constants";
import { revalidatePath } from "next/cache";

export async function addAnswer(formData: FormData) {
  const subjectId = formData.get("subjectId");
  const newSubjectName = formData.get("newSubjectName");
  const week = formData.get("week");
  const type = formData.get("type");
  const adminPassword = formData.get("adminPassword");

  // Simple admin password check (replace with a more secure method in production)
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return { status: "error", message: "Wrong password" } as const;
  }
  const content = formData.get("content");

  if (typeof week !== "string" || typeof content !== "string") {
    const problem = typeof week !== "string" ? "week" : "content";
    return {
      status: "error",
      message: `Invalid form data for ${problem}`,
    } as const;
  }

  if (typeof type !== "string" || !post.type.enumValues.includes(type)) {
    return {
      status: "error",
      message: "Invalid form data for type",
    } as const;
  }

  let finalSubjectId: number;

  if (subjectId === newValue) {
    if (typeof newSubjectName !== "string") {
      return {
        status: "error",
        message: "Invalid form data for new subject",
      } as const;
    }
    const matchingSubjects = await db
      .select({ id: subject.id })
      .from(subject)
      .where(eq(subject.name, newSubjectName));

    if (matchingSubjects.length > 0) {
      finalSubjectId = matchingSubjects[0].id;
    } else {
      const result = await db
        .insert(subject)
        .values({ name: newSubjectName })
        .returning({ id: subject.id });
      finalSubjectId = result[0].id;
    }
  } else {
    finalSubjectId = parseInt(subjectId as string);
  }

  try {
    const postId = await db
      .insert(post)
      .values({
        subjectId: finalSubjectId,
        week: parseInt(week),
        content,
        type: type,
      })
      .returning({ id: post.id })
      .then((res) => res[0].id);
    revalidatePath("/", "layout");
    return { status: "success", postId } as const;
  } catch (e) {
    return { status: "error", message: String(e) } as const;
  }
}
