import { Link } from "@remix-run/react";
import { Menu } from "~/lib/shopify/types";

export default function Footer({ menu }: { menu: Menu[] }) {
  return (
    <footer className=" flex flex-col gap-2 sm:flex-row py-6 w-full shink-0 items-center px-4 md:px-6 border-t">
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        {menu.length > 0 ? (
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className="text-gray-700 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </footer>
  );
}
