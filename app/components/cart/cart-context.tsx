import { createContext, useContext } from "react";
import { Cart, Product, ProductVariant } from "~/lib/shopify/types";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (mechandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a cartProvider");
  }

  return context;
}
