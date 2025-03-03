import { ProductOption, ProductVariant } from "~/lib/shopify/types";
import { useProduct, useUpdateURL } from "./product-context";
import clsx from "clsx";
import { useFetcher } from "@remix-run/react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const fetcher = useFetcher();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) return null;

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLocaleLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  return options.map((option) => (
    <fetcher.Form key={option.id} action="/cart">
      <dl className="mb-3">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLocaleLowerCase();

            // base option params on current selected options so we can preserve any other param state
            const optionParams = { ...state, [optionNameLowerCase]: value };

            // filter out invalid options and check if the options convinations is available for sale
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) =>
                  option.name.toLocaleLowerCase() === key && option.values.includes(value)
              )
            );

            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale
              )
            );

            // the option is active if is the selected options
            const isActive = state[optionNameLowerCase] === value;
            return (
              <button
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value} ${!isAvailableForSale ? "(Out of stock)" : ""}`}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                  {
                    "cursor-default ring-2 ring-blue-600": isActive,
                    "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                      !isAvailableForSale,
                  }
                )}
                onClick={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  console.log(
                    "🚀 ~ variant-selector.tsx:83 ~ {option.values.map ~ newState:",
                    newState
                  );

                  updateURL(newState);
                }}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </fetcher.Form>
  ));
}
