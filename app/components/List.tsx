"use client";

import { use, useEffect, useState, useRef } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Post from "./Post";
import {
  selectedImageIndexParamName,
  selectedPostIdParamName,
  subjectParamName,
  typeParamName,
  weekParamName,
} from "@/app/lib/constants";
import { post } from "@/db/schema";
import PopoverCarousel from "./PopoverCarousel";
import { AnimatePresence, motion } from "motion/react";

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
  const [queryType] = useQueryState(typeParamName);
  const [selectedPostId, setSelectedPostId] = useQueryState(
    selectedPostIdParamName,
    parseAsInteger,
  );
  const [imageIndex, setImageIndex] = useQueryState(
    selectedImageIndexParamName,
    parseAsInteger.withDefault(0),
  );
  const [isClosing, setIsClosing] = useState(false);

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

  const selectedPost = !isClosing
    ? posts.find((post) => post.id === selectedPostId)
    : undefined;

  const selectedImages = images
    .filter((image) => image.postId === selectedPost?.id)
    .map((image, index) => ({
      ...image,
      alt: `${selectedPost?.content} (${index + 1})` || String(index),
    }));

  const filteredPosts = posts.filter((post) => {
    if (queryWeek && post.week !== queryWeek) return false;
    if (querySubject && post.subject !== querySubject) return false;
    if (queryType && post.type !== queryType) return false;
    return true;
  });

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={String(filteredPosts)}
          className="wrapper grid gap-3 py-3"
          initial={{ opacity: isLoading ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <InnerList
            subject={querySubject}
            week={queryWeek}
            type={queryType}
            posts={filteredPosts.map((post) => ({
              ...post,
              images: images
                .filter((image) => image.postId === post.id)
                .map((image) => ({
                  ...image,
                  alt: post.content,
                })),
            }))}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence
        onExitComplete={() => {
          setSelectedPostId(null);
          setImageIndex(null);
          setIsClosing(false);
        }}
      >
        {selectedImages.length > 0 && !isClosing && (
          <PopoverCarousel
            selectedImages={selectedImages}
            imageIndex={imageIndex}
            setClosed={() => {
              setIsClosing(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const InnerList = ({
  subject,
  week,
  type,
  posts,
}: {
  subject: string;
  week: number;
  type: string | null;
  posts: {
    content: string;
    id: number;
    week: number;
    subject: string;
    type?: "تقييم" | "أداء منزلي" | "أداء صفي" | null | undefined;
    images: {
      postId: number;
      url: string;
      width: number | null;
      height: number | null;
      alt: string;
    }[];
  }[];
}) => {
  const optimalNumberToShow = useRef(3);
  const [numberToShow, setNumberToShow] = useState<number>(3);
  useEffect(() => {
    optimalNumberToShow.current = Math.ceil(screen.height / 500);
    setNumberToShow((n) => Math.max(optimalNumberToShow.current, n));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    window.addEventListener(
      "scroll",
      () => {
        if (numberToShow >= posts.length) return;
        if (
          document.body.scrollHeight - window.scrollY <
          screen.availHeight * 2
        ) {
          setNumberToShow((n) => n + optimalNumberToShow.current);
        }
      },
      { signal },
    );
    return () => controller.abort();
  }, [numberToShow, posts.length]);

  if (posts.length === 0)
    return <h2 className="grid w-full justify-center py-10">ﻻ توجد نتائج.</h2>;

  return (
    <>
      {posts.slice(0, numberToShow).map((post, index) => (
        <Post
          key={post.id}
          week={post.week}
          subject={post.subject}
          type={post.type}
          content={post.content}
          subjectSelected={Boolean(subject)}
          weekSelected={Boolean(week)}
          typeSelected={Boolean(type)}
          eager={index < 2}
          images={post.images}
        />
      ))}
    </>
  );
};

export default List;
