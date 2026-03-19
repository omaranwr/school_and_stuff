"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Post from "./Post";
import {
  selectedImageIndexParamName,
  selectedPostIdParamName,
  subjectParamName,
  weekParamName,
} from "@/app/lib/constants";
import { post } from "@/db/schema";
import PopoverCarousel from "./PopoverCarousel";

function List({
  postsPromise,
  imagesPromise,
}: {
  postsPromise: Promise<
    {
      id: number;
      content: string | null;
      week: number;
      subject: string;
      type?: (typeof post.type.enumValues)[number] | null;
    }[]
  >;
  imagesPromise: Promise<
    {
      postId: number;
      url: string;
      width: number | null;
      height: number | null;
    }[]
  >;
}) {
  const uncontentedPosts = use(postsPromise);
  const images = use(imagesPromise);
  const [querySubject] = useQueryState(subjectParamName, { defaultValue: "" });
  const [queryWeek] = useQueryState(
    weekParamName,
    parseAsInteger.withDefault(0),
  );
  const [selectedPostId, setSelectedPostId] = useQueryState(
    selectedPostIdParamName,
    parseAsInteger,
  );
  const [imageIndex, setImageIndex] = useQueryState(
    selectedImageIndexParamName,
    parseAsInteger.withDefault(0),
  );

  const posts = uncontentedPosts.map((post) => {
    let newContent: string = "";
    switch (post.type) {
      case "تقييم":
        newContent = "تقييم ال" + post.subject + " أسبوع " + post.week;
        break;
      case "أداء صفي":
        newContent = "أداء ال" + post.subject + " الصفي أسبوع " + post.week;
        break;
      case "أداء منزلي":
        newContent = "أداء ال" + post.subject + " المنزلي أسبوع " + post.week;
        break;
      default:
        newContent = post.subject + " أسبوع " + post.week;
        break;
    }
    return {
      ...post,
      content: post.content || newContent,
    };
  });

  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const selectedImages = images
    .filter((image) => image.postId === selectedPost?.id)
    .map((image, index) => ({
      ...image,
      alt: `${selectedPost?.content} ${index}` || String(index),
    }));

  const filteredPosts = posts.filter((post) => {
    if (queryWeek && post.week !== queryWeek) return false;
    if (querySubject && post.subject !== querySubject) return false;
    return true;
  });

  if (filteredPosts.length === 0)
    return (
      <h2 className="grid w-full justify-center py-10">No answers found.</h2>
    );

  return (
    <>
      <div className="wrapper grid gap-3 py-3">
        {filteredPosts.map((post, index) => (
          <Post
            key={post.id}
            week={post.week}
            subject={post.subject}
            content={post.content}
            subjectSelected={Boolean(querySubject)}
            weekSelected={Boolean(queryWeek)}
            eager={index < 2}
            images={images
              .filter((image) => image.postId === post.id)
              .map((image, index) => ({
                ...image,
                alt: `${post.content} ${index}` || String(index),
              }))}
          />
        ))}
      </div>

      <PopoverCarousel
        selectedImages={selectedImages}
        imageIndex={imageIndex}
        setClosed={() => {
          setSelectedPostId(null);
          setImageIndex(null);
        }}
      />
    </>
  );
}

export default List;
