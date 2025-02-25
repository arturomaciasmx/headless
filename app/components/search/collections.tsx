import clsx from "clsx";
import { Suspense } from "react";
import { Collection } from "~/lib/shopify/types";
import FilterList from "~/components/search/filter";

function CollectionList({ collections }: { collections: Collection[] }) {
  return <FilterList list={collections} title="Collections" />;
}

const skaleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-natural-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections({ collections }: { collections: Collection[] }) {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skaleton, activeAndTitles)}></div>
          <div className={clsx(skaleton, activeAndTitles)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
          <div className={clsx(skaleton, items)}></div>
        </div>
      }
    >
      <CollectionList collections={collections} />
    </Suspense>
  );
}
