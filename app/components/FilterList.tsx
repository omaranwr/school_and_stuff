"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Link from "next/link";
import { Button } from "./ui/button";

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
    <div className="wrapper flex flex-col justify-center gap-4 px-2 py-3 sm:flex-row sm:items-center">
      <div className="flex grow items-center gap-1">
        <Label htmlFor="subject">Subject: </Label>

        <Select
          id="subject"
          value={currentSubject}
          onValueChange={(value) => setCurrentSubject(value)}
        >
          <SelectTrigger className="grow">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="">All</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex grow items-center gap-1">
          <Label htmlFor="week">Week: </Label>

          <Select
            id="week"
            value={currentWeek}
            onValueChange={(value) => setCurrentWeek(value)}
          >
            <SelectTrigger className="grow" size="sm">
              <SelectValue placeholder="Select a week" />
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value={null}>All</SelectItem>
              {new Array(maxWeek).fill(0).map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={i + 1}
                  disabled={
                    !(
                      !currentSubject &&
                      new Set([...Object.values(weeks)].flat()).has(i + 1)
                    ) && !weeks[currentSubject]?.includes(i + 1)
                  }
                >
                  Week {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href={"/admin"} className="hidden">
          <Button variant={"secondary"}>Add a post</Button>
        </Link>
      </div>
    </div>
  );
}

export default FilterList;
