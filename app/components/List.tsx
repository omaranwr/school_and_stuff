"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

function List({
  postsPromise,
  weekParam,
  subjectParam,
}: {
  postsPromise: Promise<
    { id: number; content: string; week: number; subject: string }[]
  >;
  weekParam: string;
  subjectParam: string;
}) {
  const posts = use(postsPromise);
  const [queryWeek] = useQueryState(weekParam, parseAsInteger);
  const [querySubject] = useQueryState(subjectParam);

  if (posts.length === 0)
    return <div className="wrapper py-3">No Answers found</div>;

  const week = queryWeek || 0;
  const subject = querySubject || "all";

  const filteredPosts = posts.filter((post) => {
    if (week && post.week !== week) return false;
    if (subject !== "all" && post.subject !== subject) return false;
    return true;
  });

  return (
    <div className="wrapper py-3">
      {filteredPosts.map((post) => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}

export default List;
