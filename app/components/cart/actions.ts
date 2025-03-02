// import { getCartId } from "~/lib/cookies.server";
import { addToCart, getCart, removeFromCart, updateCart } from "~/lib/shopify";

export async function updateItemQuantity(payload: {
  merchandiseId: string;
  quantity: number;
}) {
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) {
    return "Missing cart ID";
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    // revalidateTag(TAGS.cart);
  } catch (error) {
    console.error(error);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  let cart = await getCart(cartId);

  if (!cart) {
    return "Error fetching cart";
  }

  redirect(cart.checkoutUrl);
}
