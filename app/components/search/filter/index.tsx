import type { SortFilterItem } from "~/lib/constants";
import { FilterItem } from "./item";
import FilterItemDropDown from "./dropdown";

export type PathFilterItem = {
  title: string;
  path: string;
};
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, index) => (
        <FilterItem key={index} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral400">
            {title}
          </h3>
        ) : null}
        <ul className="hidden md:block">
          <FilterItemList list={list} />
        </ul>
        <ul className="md:hidden">
          <FilterItemDropDown list={list} />
        </ul>
      </nav>
    </>
  );
}
