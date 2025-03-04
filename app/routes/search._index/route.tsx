
import { useLoaderData, useSearchParams, type LoaderFunctionArgs } from "react-router";
import Grid from "~/components/grid";
import { ProductGridItems } from "~/components/layout/product-grid-items";
import { defaultSort, type SortFilterItem, sorting } from "~/lib/constants";
import { getProducts } from "~/lib/shopify";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const searchValue = url.searchParams.get("q") || undefined;
  const sort = url.searchParams.get("sort");

  const { sortKey, reverse } =
    sorting.find((item: SortFilterItem) => item.slug == sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  return products;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("q");
  const products = useLoaderData<typeof loader>();
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length == 0
            ? "There are no products thet match"
            : `Showing ${products.length} ${resultsText} for `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : (
        <p className="mb-4">All Products</p>
      )}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
