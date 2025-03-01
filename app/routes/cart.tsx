import { ActionFunctionArgs, json } from "@remix-run/node";
import { addItem } from "~/components/cart/actions";
import { useCartContext } from "~/components/cart/cart-context";
import { cartCookie } from "~/lib/cookies.server";
import { createCart } from "~/lib/shopify";
import { Product } from "~/lib/shopify/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { cart, addCartItem } = useCartContext();
  // const formData = await request.formData();
  // const product = formData.get("product");
  // addCartItem();
  // try {
  //   await addItem(request, cart);
  //   return json({ message: "Item added successfully!" });
  // } catch (error) {
  //   return json({ message: "Failed to add item" }, { status: 500 });
  // }
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "createCart": {
      let cart = await createCart();
      const headers = new Headers();
      headers.append("Set-Cookie", await cartCookie.serialize(cart.id));
      return json({ success: true, cartId: cart.id }, { headers });
    }
  }
  return null;
};

export async function loader() {
  return null;
}
