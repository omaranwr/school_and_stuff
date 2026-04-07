"use client";

import { use, useEffect } from "react";
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
import {
  generateTitle,
  subjectParamName,
  typeParamName,
  weekParamName,
} from "@/lib/constants";
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

  useEffect(() => {
    document.title = generateTitle(
      currentSubject,
      currentWeek || undefined,
      currentType,
    );
  }, [currentSubject, currentType, currentWeek]);

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
    <div className="wrapper grid grid-cols-[min-content_1fr] gap-1 gap-y-2 py-3">
      <Label htmlFor="subject">المادة: </Label>

      <Select
        id="subject"
        value={currentSubject}
        onValueChange={(value) => setCurrentSubject(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر مادة" />
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectItem value="">كل المواد</SelectItem>
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

      <Label htmlFor="type">النوع: </Label>

      <Select
        id="type"
        value={currentType}
        onValueChange={(value) => setCurrentType(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر نوع" />
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectItem value="">كل الأنواع</SelectItem>
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

      <Label htmlFor="week">الأسبوع: </Label>

      <Select
        id="week"
        value={currentWeek}
        onValueChange={(value) => setCurrentWeek(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {(value) => (value ? "أسبوع " + value : "اختر أسبوع")}
          </SelectValue>
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectItem value={null}>كل الأسابيع</SelectItem>
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
                أسبوع {i + 1}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterList;
