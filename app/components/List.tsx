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
  const [queryWeek] = useQueryState(weekParam, parseAsInteger.withDefault(0));
  const [querySubject] = useQueryState(subjectParam, { defaultValue: "" });

  if (posts.length === 0)
    return <div className="wrapper py-3">No Answers found</div>;

  const filteredPosts = posts.filter((post) => {
    if (queryWeek && post.week !== queryWeek) return false;
    if (querySubject !== "" && post.subject !== querySubject) return false;
    return true;
  });

  return (
    <div className="wrapper py-3">
      {filteredPosts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <h6>Week: {post.week}</h6>
        </div>
      ))}
    </div>
  );
}

export default List;
