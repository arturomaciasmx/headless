import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { CartItem } from "~/lib/shopify/types";
import { useCartContext } from "./cart-context";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={type === "plus" ? "Increase item quantity" : "Reduce item quantity"}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  // const [message, formAction] = useFormState(updateItemQuantity, null);
  // const payload = {
  //   merchandiseId: item.merchandise.id,
  //   quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  // };
  // const actionWithVariant = formAction.bind(null, payload);
  const fetcher = useFetcher();
  const { updateCartItem } = useCartContext();
  const merchandiseId = item.merchandise.id;
  const quantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
  const handleUpdateQuantity = () => {
    updateCartItem(merchandiseId, type);
  };
  return (
    <fetcher.Form action="/cart" method="POST" onSubmit={handleUpdateQuantity}>
      <input type="hidden" name="intent" value="updateItemQuantity" />
      <input type="hidden" name="merchandiseId" value={merchandiseId} />
      <input type="hidden" name="quantity" value={quantity} />
      <SubmitButton type={type} />
      <p aria-label="polite" className="sr-only" role="status">
        {/* // {message} */}
      </p>
    </fetcher.Form>
  );
}
