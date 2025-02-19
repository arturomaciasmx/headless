import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useActionData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // const menu = await getMenu("main-menu");
  // if (!menu) {
  //   return null;
  // }
  // return menu;
  return null;
}
export function Navbar() {
  // const menu = useActionData<typeof loader>;
  return <>header</>;
}
