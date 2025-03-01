import { ActionFunctionArgs, json } from "@remix-run/node";
import { useCartContext } from "~/components/cart/cart-context";
import { cartCookie } from "~/lib/cookies.server";
import { addToCart, createCart } from "~/lib/shopify";
import { Product } from "~/lib/shopify/types";

async function getCartId(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cartId = (await cartCookie.parse(cookieHeader)) || null;
  return cartId;
}

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
      const cart = await createCart();
      const headers = new Headers();
      headers.append("Set-Cookie", await cartCookie.serialize(cart.id));
      return json({ success: true, cartId: cart.id }, { headers });
    }
    case "addToCart": {
      const selectedVariantId = formData.get("selectedVariantId") as string;
      console.log("🚀 ~ cart.tsx:36 ~ action ~ selectedVariantId:", selectedVariantId);
      const cartId = await getCartId(request);
      console.log("🚀 ~ cart.tsx:38 ~ action ~ cartId:", cartId);

      if (!cartId || !selectedVariantId) {
        return "Error adding item to cart";
      }

      try {
        const cart = await addToCart(cartId, [
          { merchandiseId: selectedVariantId, quantity: 1 },
        ]);
        console.log("🚀 ~ cart.tsx:45 ~ action ~ cart:", cart);
      } catch (error) {
        console.log("🚀 ~ action ~ error:", error);
      }

      return json({ message: "Add to cart message", ok: true });
    }
  }
  return null;
};

export async function loader() {
  return null;
}
