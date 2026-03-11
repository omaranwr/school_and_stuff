import List from "@/app/components/List";
import FilterList from "./components/FilterList";
import { db } from "@/db";
import { post, subject as subjectTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; subject?: string }>;
}) {
  const week = parseInt((await searchParams).week || "0");
  const subject = (await searchParams).subject || "all";
  const postsPromise = db
    .select({
      week: post.week,
      subject: subjectTable.name,
    })
    .from(post)
    .innerJoin(subjectTable, eq(post.subjectId, subjectTable.id))
    .all();
  return (
    <>
      <FilterList postsPromise={postsPromise} />
      <List week={week} subject={subject} />
    </>
  );
}
