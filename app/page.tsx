import List from "@/app/components/List";
import FilterList from "./components/FilterList";
import { db } from "@/db";
import { image, post, subject as subjectTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function Home() {
  const postsPromise = db
    .select({
      id: post.id,
      content: post.content,
      week: post.week,
      subject: subjectTable.name,
      type: post.type,
    })
    .from(post)
    .innerJoin(subjectTable, eq(post.subjectId, subjectTable.id))
    .orderBy(desc(post.week), post.type, subjectTable.name)
    .all();
  const imagesPromise = db
    .select({
      postId: image.postId,
      url: image.url,
      width: image.width,
      height: image.height,
    })
    .from(image)
    .orderBy(image.order)
    .all();
  return (
    <div className="flex min-h-svh flex-col">
      <FilterList postsPromise={postsPromise} />
      <List postsPromise={postsPromise} imagesPromise={imagesPromise} />
    </div>
  );
}
