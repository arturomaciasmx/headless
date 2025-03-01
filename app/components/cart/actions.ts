// import { getCartId } from "~/lib/cookies.server";
import { cartCookie } from "~/lib/cookies.server";
import {
  addToCart,
  AddToCart,
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

export async function addItem(request: Request, selectedVariantId: string | undefined) {
  const cartId = await getCartId(request);
  if (!cartId || !selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    const cart = await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    console.log("🚀 ~ actions.ts:29 ~ addItem ~ cart:", cart);
  } catch (error) {
    return "Error adding item to cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
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

export async function removeItem(prevState: any, merchandiseId: string) {
  let cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      // revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (error) {
    return "Error removing item from cart";
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

// export async function createCartAndSetCookie() {
//   let cart = await createCart();
//   // cookies().set("cartId", cart.id!);
// }
