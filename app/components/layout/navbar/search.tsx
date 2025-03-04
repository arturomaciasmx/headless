import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
      navigate({
        pathname: "/search",
        search: newParams.toString(),
      });
    } else {
      newParams.delete("q");
    }
  }

  return (
    <form
      action=""
      onSubmit={onSubmit}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <input
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        className="text-md w-full rounded-lg bg-white px-4 text-black placeholder:text-neutral-500 md:text-sm border p-2"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassCircleIcon className="h-4" />
      </div>
    </form>
  );
}

export function searchSkaleton() {
  return (
    <form className="w-max-[500px] relative w-full lg:w-80 xl:w-full">
      <input type="text" placeholder="Search for products..." />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassCircleIcon className="h-4" />
      </div>
    </form>
  );
}
