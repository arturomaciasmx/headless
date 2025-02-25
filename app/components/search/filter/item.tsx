import { Link, useLocation, useSearchParams } from "@remix-run/react";
import { ListItem, type PathFilterItem } from ".";
import clsx from "clsx";
import { type SortFilterItem } from "~/lib/constants";
import { createUrl } from "~/lib/utils";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const active = location.pathname == item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;
  const href = createUrl(item.path, newParams);
  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        to={href}
        className={clsx("w-full text-sm underline-offset-4 dark:hover:text-neutral-100", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const active = searchParams.get("sort") == item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    })
  );
  const DynamicTag = active ? "p" : Link;

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        to={href}
        className={clsx("w-full text-sm underline-offset-4 dark:hover:text-neutral-100", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
