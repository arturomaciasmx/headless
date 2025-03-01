import { ActionFunctionArgs, json } from "@remix-run/node";
import { addItem } from "~/components/cart/actions";
import { useCartContext } from "~/components/cart/cart-context";
import { Product } from "~/lib/shopify/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { cart, addCartItem } = useCartContext();
  const formData = await request.formData();
  const product = formData.get("product");

  // addCartItem();

  // try {
  //   await addItem(request, cart);
  //   return json({ message: "Item added successfully!" });
  // } catch (error) {
  //   return json({ message: "Failed to add item" }, { status: 500 });
  // }
};
