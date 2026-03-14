"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Post from "./Post";

function List({
  postsPromise,
  weekParam,
  subjectParam,
}: {
  postsPromise: Promise<
    { id: number; content: string | null; week: number; subject: string }[]
  >;
  weekParam: string;
  subjectParam: string;
}) {
  const posts = use(postsPromise);
  const [queryWeek] = useQueryState(weekParam, parseAsInteger.withDefault(0));
  const [querySubject] = useQueryState(subjectParam, { defaultValue: "" });

  if (posts.length === 0)
    return <div className="wrapper py-3">No Answers found</div>;

  const filteredPosts = posts.filter((post) => {
    if (queryWeek && post.week !== queryWeek) return false;
    if (querySubject && post.subject !== querySubject) return false;
    return true;
  });

  return (
    <div className="wrapper grid gap-3 py-3">
      {filteredPosts.map((post) => (
        <Post
          key={post.id}
          week={post.week}
          subject={post.subject}
          content={post.content}
          showSubject={!querySubject}
          showWeek={!queryWeek}
        />
      ))}
    </div>
  );
}

export default List;
