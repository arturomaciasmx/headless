import { getCartId } from "~/lib/cookies.server";
import { AddToCart } from "~/lib/shopify";

export async function addItem(
  request: Request,
  prevState: any,
  selectedVariantId: string | undefined
) {
  const cartId = await getCartId(request);

  if (!cartId || !selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await AddToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
  } catch (error) {
    return "Error adding item to cart";
  }
}
