"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

function FilterList({
  postsPromise,
  weekParam,
  subjectParam,
}: {
  postsPromise: Promise<{ week: number; subject: string }[]>;
  weekParam: string;
  subjectParam: string;
}) {
  const posts = use(postsPromise);
  const [currentWeek, setCurrentWeek] = useQueryState(
    weekParam,
    parseAsInteger.withDefault(0),
  );
  const [currentSubject, setCurrentSubject] = useQueryState(subjectParam, {
    defaultValue: "",
  });

  const subjects = [...new Set(posts.map((post) => post.subject))];
  let maxWeek = 0;
  const weeks: { [key: string]: Array<number> } = {};
  posts.forEach((post) => {
    weeks[post.subject] ||= [];
    weeks[post.subject].push(post.week);
    if (post.week > maxWeek) maxWeek = post.week;
  });

  return (
    <div className="bg-foreground text-background flex w-full flex-col gap-4 px-2 py-5">
      <div className="wrapper flex">
        <label htmlFor="subject" className="mr-2">
          Subject:
        </label>
        <select
          id="subject"
          value={currentSubject}
          onChange={(e) => setCurrentSubject(e.target.value)}
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
          value={currentWeek}
          onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
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
