import List from "@/app/components/List";
import FilterList from "./components/FilterList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; subject?: string }>;
}) {
  const week = parseInt((await searchParams).week || "0");
  const subject = (await searchParams).subject || "all";
  return (
    <>
      <FilterList />
      <List week={week} subject={subject} />
    </>
  );
}
