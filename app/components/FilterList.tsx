"use client";

import { use } from "react";
import { useQueryState } from "nuqs";
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
  const [currentWeek, setCurrentWeek] = useQueryState(weekParam, {
    defaultValue: "0",
  });
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
    <>
      <div className="wrapper">
        <Label htmlFor="subject" className="mr-2">
          Subject:
        </Label>

        <Select
          value={currentSubject}
          onValueChange={(value) => setCurrentSubject(value)}
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="wrapper">
        <Label htmlFor="week" className="mr-2">
          Week:
        </Label>
        <Select
          value={currentWeek}
          onValueChange={(value) => setCurrentWeek(value)}
        >
          <SelectTrigger id="week">
            <SelectValue placeholder="Select a week" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {new Array(maxWeek).fill(0).map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={String(i + 1)}
                  disabled={!weeks[currentSubject]?.includes(i + 1)}
                >
                  {i + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export default FilterList;
