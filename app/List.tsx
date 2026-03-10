"use client";

import { useSearchParams } from "next/dist/client/components/navigation";
import database from "./tempDatabase.json";

function List() {
  const searchParams = useSearchParams();
  if (!searchParams.get("subject")) return <div>Please select a subject.</div>;
  if (!searchParams.get("week")) return <div>Please select a week.</div>;
  const content =
    database[searchParams.get("subject")][searchParams.get("week") - 1][
      "content"
    ];
  return <div>{content}</div>;
}

export default List;
