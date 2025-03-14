import { redirect, type ActionFunctionArgs } from "react-router";
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
      return Response.json({ success: true, cartId: cart.id }, { headers });
    }
    case "addToCart": {
      const selectedVariantId = formData.get("selectedVariantId") as string;
      const cartId = await getCartId(request);

      if (!cartId || !selectedVariantId) {
        return "Error adding item to cart";
      }

      try {
        await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
        return Response.json({ message: "Item added successfully", ok: true });
      } catch (error) {
        return Response.json({ message: "Error adding item to cart", ok: false });
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
          return Response.json({ message: "Success: Iteme deleted from cart", ok: true });
        } else {
          return Response.json({ message: "Error: Item not found in cart", ok: false });
        }
      } catch (error) {
        console.log("🚀 ~ cart.tsx:58 ~ action ~ error:", error);
        return Response.json({ message: "Error removing item", ok: false });
      }
    }
    case "updateItemQuantity": {
      const cartId = await getCartId(request);

      if (!cartId) {
        return Response.json({ message: "Missing cart ID", ok: false });
      }

      const merchandiseId = formData.get("merchandiseId") as string;
      const quantity = Number(formData.get("quantity"));

      try {
        const cart = await getCart(cartId);
        if (!cart) {
          return Response.json({ message: "Error fetching cart", ok: false });
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
        return Response.json({ message: "Success: quantity updated", ok: false });
      } catch (error) {
        return Response.json({ message: { error }, ok: false });
      }
    }
    case "redirectToCheckout": {
      const cartId = await getCartId(request);

      if (!cartId) {
        return Response.json({ message: "Missing cart id", ok: false });
      }

      const cart = await getCart(cartId);

      if (!cart) {
        return Response.json({ message: "Error fetching cart", ok: false });
      }
      console.log(cart.checkoutUrl);

      return redirect(cart.checkoutUrl);
    }
  }
  return null;
};

export async function loader() {
  return null;
}
