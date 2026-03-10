import { Suspense } from "react";
import FilterList from "./FilterList";
import List from "./List";

export default function Home() {
  return (
    <>
      <Suspense>
        <FilterList />
      </Suspense>
      <Suspense>
        <List />
      </Suspense>
    </>
  );
}
