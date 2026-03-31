import List from "@/app/components/List";
import FilterList from "./components/FilterList";
import { db } from "@/db";
import { image, post, subject as subjectTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { credits } from "@/app/lib/constants";

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
    .orderBy(image.postId, image.order)
    .all();
  return (
    <div className="flex min-h-svh flex-col">
      <FilterList postsPromise={postsPromise} />
      <div className="text-muted-foreground wrapper py-3 text-sm">
        <span>الأداءات مأخوذة من: </span>
        <ul className="inline-flex flex-wrap gap-3 gap-y-0.5 ps-3">
          {credits.map(({ name }, index) => {
            return (
              <li key={index} className="flex grow-0 items-center gap-1">
                <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                {name}
              </li>
            );
          })}
        </ul>
      </div>
      <List postsPromise={postsPromise} imagesPromise={imagesPromise} />
    </div>
  );
}
