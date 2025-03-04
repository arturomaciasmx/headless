import { useLocation, useSearchParams } from "react-router";
import { type ListItem } from ".";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterItem } from "./item";

export default function FilterItemDropDown({ list }: { list: ListItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCickOutdide = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleCickOutdide);

    return () => window.removeEventListener("click", handleCickOutdide);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname == listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") == listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white"
      >
        {active}
        <ChevronDownIcon className="h-4" />
      </button>
      {openSelect && (
        <button
          onClick={() => setOpenSelect(false)}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {list.map((item: ListItem, index) => (
            <FilterItem item={item} key={index} />
          ))}
        </button>
      )}
    </div>
  );
}
