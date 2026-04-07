import { Spinner } from "@/components/ui/spinner";

function loading() {
  return (
    <div className="flex h-svh w-svw items-center justify-center">
      <Spinner />
    </div>
  );
}

export default loading;
