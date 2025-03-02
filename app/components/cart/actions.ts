// import { getCartId } from "~/lib/cookies.server";
import { getCart } from "~/lib/shopify";

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
