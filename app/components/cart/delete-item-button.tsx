import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CartItem } from "~/lib/shopify/types";
import { useFetcher } from "react-router";
import { useCartContext } from "./cart-context";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const fetcher = useFetcher();
  const { updateCartItem } = useCartContext();
  // const [message, formAction] = useFormState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  // const actionWithVariant = formAction.bind(null, merchandiseId);

  const handleRemoveItem = () => {
    updateCartItem(merchandiseId, "delete");
  };

  return (
    <fetcher.Form method="post" action="/cart" onSubmit={handleRemoveItem}>
      <input type="hidden" name="intent" value="removeItem" />
      <input type="hidden" name="merchandiseId" value={merchandiseId} />
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {/* {message} */}
      </p>
    </fetcher.Form>
  );
}
