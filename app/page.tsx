import List from "./List";
import FilterList from "./FilterList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  return (
    <>
      <FilterList />
      <List
        week={parseInt(params["week"]!) || 0}
        subject={params["subject"]!}
      />
    </>
  );
}
