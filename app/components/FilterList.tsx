"use client";

import { use } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  subjectParamName,
  typeParamName,
  weekParamName,
} from "@/app/lib/constants";
import { post } from "@/db/schema";

function FilterList({
  postsPromise,
}: {
  postsPromise: Promise<
    {
      week: number;
      subject: string;
      type?: (typeof post.type.enumValues)[number] | null;
    }[]
  >;
}) {
  const posts = use(postsPromise);
  const [currentWeek, setCurrentWeek] = useQueryState(
    weekParamName,
    parseAsInteger,
  );
  const [currentSubject, setCurrentSubject] = useQueryState(subjectParamName, {
    defaultValue: "",
  });
  const [currentType, setCurrentType] = useQueryState(typeParamName, {
    defaultValue: "",
  });

  let maxWeek = 0;
  for (const post of posts) {
    maxWeek = Math.max(maxWeek, post.week);
  }

  const postHas = (
    week?: number | null,
    subject?: string | null,
    type?: string | null,
  ) => {
    const foundPost = posts.find((post) => {
      if (week && post.week !== week) return false;
      if (subject && post.subject !== subject) return false;
      if (type && post.type !== type) return false;
      return true;
    });
    return Boolean(foundPost);
  };

  const subjects = [...new Set(posts.map((post) => post.subject))];

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
            <SelectGroup>
              <SelectItem value="">All</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              {subjects.map((subject) => (
                <SelectItem
                  key={subject}
                  value={subject}
                  className={
                    postHas(currentWeek, subject, currentType)
                      ? ""
                      : "text-muted-foreground"
                  }
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex grow items-center gap-1">
        <Label htmlFor="type">Type: </Label>

        <Select
          id="type"
          value={currentType}
          onValueChange={(value) => setCurrentType(value)}
        >
          <SelectTrigger className="grow">
            <SelectValue placeholder="Select a Type" />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectItem value="">All</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              {post.type.enumValues.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className={
                    postHas(currentWeek, currentSubject, type)
                      ? ""
                      : "text-muted-foreground"
                  }
                >
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
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
              <SelectValue>
                {(value) => (value ? "Week " + value : "Select a week")}
              </SelectValue>
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value={null}>All</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                {new Array(maxWeek).fill(0).map((_, i) => (
                  <SelectItem
                    key={i + 1}
                    value={i + 1}
                    className={
                      postHas(i + 1, currentSubject, currentType)
                        ? ""
                        : "text-muted-foreground"
                    }
                  >
                    Week {i + 1}
                  </SelectItem>
                ))}
              </SelectGroup>
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
