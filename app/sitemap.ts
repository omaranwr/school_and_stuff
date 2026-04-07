import { MetadataRoute } from "next";
import { db } from "@/db";
import { post, subject } from "@/db/schema";
import { eq } from "drizzle-orm";
import { subjectParamName, weekParamName } from "../lib/constants";
import xmlescape from "xml-escape";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL;
  if (baseUrl === undefined) throw Error("Base URL env variable is undefined");

  // Main page with highest priority
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const posts = await db
      .select({ week: post.week, subject: subject.name })
      .from(post)
      .innerJoin(subject, eq(post.subjectId, subject.id))
      .all();

    const weeks = new Set(posts.map((post) => post.week));
    const subjets = new Set(posts.map((post) => post.subject));

    weeks.forEach((week) => {
      pages.push({
        url: `${baseUrl}/?${weekParamName}=${week}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    subjets.forEach((subjectName) => {
      pages.push({
        url: `${baseUrl}/?${subjectParamName}=${subjectName}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    posts.forEach((post) => {
      pages.push({
        url: xmlescape(
          `${baseUrl}/?${subjectParamName}=${post.subject}&${weekParamName}=${post.week}`,
        ),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  } catch (error) {
    console.error("Error fetching for sitemap:", error);
  }

  return pages;
}
