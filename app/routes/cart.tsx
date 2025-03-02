import { ActionFunctionArgs, json } from "@remix-run/node";
import { cartCookie } from "~/lib/cookies.server";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "~/lib/shopify";

async function getCartId(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cartId = (await cartCookie.parse(cookieHeader)) || null;
  return cartId;
}

export const action = async ({ request }: ActionFunctionArgs) => {
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
      const cartId = await getCartId(request);

      if (!cartId || !selectedVariantId) {
        return "Error adding item to cart";
      }

      try {
        await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
        return json({ message: "Item added successfully", ok: true });
      } catch (error) {
        return json({ message: "Error adding item to cart", ok: false });
      }
    }
    case "removeItem": {
      const cartId = await getCartId(request);
      const merchandiseId = formData.get("merchandiseId") as string;

      if (!cartId) {
        return "Missing cart ID";
      }

      try {
        const cart = await getCart(cartId);
        const lineItem = cart?.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );

        if (lineItem && lineItem.id) {
          await removeFromCart(cartId, [lineItem.id]);
          return json({ message: "Success: Iteme deleted from cart", ok: true });
        } else {
          return json({ message: "Error: Item not found in cart", ok: false });
        }
      } catch (error) {
        console.log("🚀 ~ cart.tsx:58 ~ action ~ error:", error);
        return json({ message: "Error removing item", ok: false });
      }
    }
    case "updateItemQuantity": {
      const cartId = await getCartId(request);

      if (!cartId) {
        return json({ message: "Missing cart ID", ok: false });
      }

      const merchandiseId = formData.get("merchandiseId") as string;
      const quantity = Number(formData.get("quantity"));

      try {
        const cart = await getCart(cartId);
        if (!cart) {
          return json({ message: "Error fetching cart", ok: false });
        }

        const lineItem = cart?.lines.find(
          (line) => line.merchandise.id === merchandiseId
        );

        if (lineItem && lineItem?.id) {
          if (quantity === 0) {
            await removeFromCart(cartId, [lineItem?.id]);
          } else {
            await updateCart(cartId, [{ id: lineItem.id, merchandiseId, quantity }]);
          }
        } else if (quantity > 0) {
          await addToCart(cartId, [{ merchandiseId, quantity }]);
        }
      } catch (error) {
        return json({ message: { error }, ok: false });
      }
    }
  }
  return null;
};

export async function loader() {
  return null;
}
