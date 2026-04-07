import List from "@/app/components/List";
import FilterList from "./components/FilterList";
import { db } from "@/db";
import { image, post, subject as subjectTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { credits, generateTitle } from "@/app/lib/constants";
import { type Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<Metadata> {
  const { subject, type, week } = await searchParams;
  return { title: generateTitle(subject, Number(week), type) };
}

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
        <ul className="inline-flex flex-wrap items-center">
          <span className="pe-0.75">الأداءات مأخوذة من: </span>
          {credits.map(({ name }, index) => {
            return (
              <li
                key={index}
                className="flex grow-0 items-center gap-0.5 ps-1.75"
              >
                <div className="bg-muted-foreground h-0.75 w-0.75 rounded-full" />
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
