"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

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
    parseAsInteger,
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
    <div className="wrapper grid grid-cols-[3fr_1fr] gap-4 px-2 py-3">
      <div className="wrapper flex">
        <Label htmlFor="subject">Subject: </Label>

        <Select
          value={currentSubject}
          onValueChange={(value) => setCurrentSubject(value)}
        >
          <SelectTrigger id="subject" className="grow">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectItem value="">All</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="wrapper flex">
        <Label htmlFor="week">Week: </Label>

        <Select
          value={currentWeek}
          onValueChange={(value) => setCurrentWeek(value)}
        >
          <SelectTrigger id="week" className="grow">
            <SelectValue placeholder="Select a week" />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectItem value={null}>All</SelectItem>
              {new Array(maxWeek).fill(0).map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={i + 1}
                  disabled={
                    currentSubject !== "" &&
                    !weeks[currentSubject]?.includes(i + 1)
                  }
                >
                  {i + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterList;
