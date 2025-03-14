import { Outlet, useLoaderData } from "react-router";
import Collections from "~/components/search/collections";
import FilterList from "../../components/search/filter";
import { sorting } from "~/lib/constants";
import { getCollections } from "~/lib/shopify";

export async function loader() {
  const collections = await getCollections();
  return collections;
}

export default function SearchLayout() {
  const collections = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections collections={collections} />
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <Outlet />
      </div>
      <div className="order-none flex-none md:order-none md:max-w-[125px]">
        <FilterList list={sorting} title="Sort by" />
      </div>
    </div>
  );
}
