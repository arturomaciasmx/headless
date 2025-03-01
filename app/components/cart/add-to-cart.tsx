import { Product, ProductVariant } from "~/lib/shopify/types";
import { useProduct } from "../product/product-context";
import { useCartContext } from "./cart-context";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add to Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { state } = useProduct();
  const fetcher = useFetcher();
  const { addCartItem } = useCartContext();

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)!;

  useEffect(() => {}, [fetcher]);
  const handleAddToCart = () => {
    addCartItem(finalVariant, product);
  };
  return (
    <fetcher.Form method="post" action="/cart" onSubmit={handleAddToCart}>
      <input type="hidden" name="variant" value={JSON.stringify(finalVariant)} />
      <input type="hidden" name="product" value={JSON.stringify(product)} />
      <input type="hidden" name="intent" value="AddToCart" />
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p className="sr-only" role="status" aria-label="polite">
        {/* {fetcher.data.message} */}
      </p>
    </fetcher.Form>
  );
}
