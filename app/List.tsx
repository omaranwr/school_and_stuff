import { post, subject as subjectTable } from "@/db/schema";
import Post from "./Post";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

async function List({ week, subject }: { week: number; subject: string }) {
  const subjectId = (
    await db
      .select({ id: subjectTable.id })
      .from(subjectTable)
      .where(eq(subjectTable.name, subject))
      .limit(1)
  )[0]?.id;
  if (!subjectId) {
    return <div className="wrapper py-3">No subject found</div>;
  }
  const posts = await db
    .select()
    .from(post)
    .where(and(eq(post.week, week), eq(post.subjectId, subjectId)));
  return (
    <div className="wrapper py-3">
      {posts.map((post) => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}

export default List;
