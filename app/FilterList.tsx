"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

function FilterList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const subjects = ["All", "Math", "Science", "English", "History"];
  const weeks = [
    "All",
    ...Array.from({ length: 52 }, (_, i) => (i + 1).toString()),
  ];

  const currentSubject = searchParams.get("subject") || "All";
  const currentWeek = searchParams.get("week") || "All";

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All") params.delete(key);
    else params.set(key, value);
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleSubjectChange = (value: string) => {
    handleChange("subject", value);
  };

  const handleWeekChange = (value: string) => {
    handleChange("week", value);
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
          value={currentSubject}
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
          value={currentWeek}
          onChange={(e) => handleWeekChange(e.target.value)}
          className="outline-background grow p-1 outline"
        >
          {weeks.map((week) => (
            <option key={week} value={week}>
              {week}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterList;
