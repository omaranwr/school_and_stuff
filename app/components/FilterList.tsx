"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";

function FilterList({
  postsPromise,
}: {
  postsPromise: Promise<{ week: number; subject: string }[]>;
}) {
  const posts = use(postsPromise);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const subjects = [...new Set(posts.map((post) => post.subject))];
  let maxWeek = 0;
  const weeks: { [key: string]: Array<number> } = {};
  posts.forEach((post) => {
    weeks[post.subject] ||= [];
    weeks[post.subject].push(post.week);
    if (post.week > maxWeek) maxWeek = post.week;
  });

  const currentSubject = searchParams.get("subject") || "All";
  const [optimisticSubject, setOptimisticSubject] =
    useOptimistic(currentSubject);

  const currentWeek = searchParams.get("week") || "All";
  const [optimisticWeek, setOptimisticWeek] = useOptimistic(currentWeek);

  const handleChange = (
    key: string,
    value: string,
    setOptimistic?: (
      action: string | ((pendingState: string) => string),
    ) => void,
  ) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All") params.delete(key);
    else params.set(key, value);
    startTransition(() => {
      if (setOptimistic) setOptimistic(value);
      router.replace(`?${params.toString()}`);
    });
  };

  const handleSubjectChange = (value: string) => {
    handleChange("subject", value, setOptimisticSubject);
  };

  const handleWeekChange = (value: string) => {
    handleChange("week", value, setOptimisticWeek);
  };

  return (
    <div
      className="bg-foreground text-background flex w-full flex-col gap-4 px-2 py-5 data-[pending=true]:opacity-50"
      data-pending={isPending}
    >
      <div className="wrapper flex">
        <label htmlFor="subject" className="mr-2">
          Subject:
        </label>
        <select
          id="subject"
          value={optimisticSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="outline-background grow p-1 outline"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      <div className="wrapper flex">
        <label htmlFor="week" className="mr-2">
          Week:
        </label>
        <select
          id="week"
          value={optimisticWeek}
          onChange={(e) => handleWeekChange(e.target.value)}
          className="outline-background grow p-1 outline"
        >
          {new Array(maxWeek).fill(0).map((_, i) => (
            <option
              key={i + 1}
              value={i + 1}
              disabled={!weeks[currentSubject]?.includes(i + 1)}
            >
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterList;
