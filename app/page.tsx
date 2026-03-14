import List from "@/app/components/List";
import FilterList from "./components/FilterList";
import { db } from "@/db";
import { image, post, subject as subjectTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

const weekParam = "week";
const subjectParam = "subject";

export default async function Home() {
  const postsPromise = db
    .select({
      id: post.id,
      content: post.content,
      week: post.week,
      subject: subjectTable.name,
    })
    .from(post)
    .innerJoin(subjectTable, eq(post.subjectId, subjectTable.id))
    .orderBy(desc(post.week))
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
    <>
      <FilterList
        postsPromise={postsPromise}
        weekParam={weekParam}
        subjectParam={subjectParam}
      />
      <List
        postsPromise={postsPromise}
        imagesPromise={imagesPromise}
        weekParam={weekParam}
        subjectParam={subjectParam}
      />
    </>
  );
}
