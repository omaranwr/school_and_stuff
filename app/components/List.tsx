"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Post from "./Post";

function List({
  postsPromise,
  imagesPromise,
  weekParam,
  subjectParam,
}: {
  postsPromise: Promise<
    { id: number; content: string | null; week: number; subject: string }[]
  >;
  imagesPromise: Promise<
    {
      postId: number;
      url: string;
      width: number | null;
      height: number | null;
    }[]
  >;
  weekParam: string;
  subjectParam: string;
}) {
  const posts = use(postsPromise);
  const images = use(imagesPromise);
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
          subjectSelected={Boolean(querySubject)}
          weekSelected={Boolean(queryWeek)}
          images={images
            .filter((image) => image.postId === post.id)
            .map((image, index) => ({
              ...image,
              alt: `${post.content} ${index}` || String(index),
            }))}
        />
      ))}
    </div>
  );
}

export default List;
