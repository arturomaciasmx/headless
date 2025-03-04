import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import Grid from "~/components/grid";
import { ProductGridItems } from "~/components/layout/product-grid-items";
import { defaultSort, sorting } from "~/lib/constants";
import { getCollectionProducts } from "~/lib/shopify";
import type { Product } from "~/lib/shopify/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { sort, collection } = params;
  const { sortKey, reverse } = sorting.find((item) => item.slug == sort) || defaultSort;
  if (collection) {
    const products = await getCollectionProducts({
      collection,
      sortKey,
      reverse,
    });
    return products;
  }
  return [];
}

export default function SearchCollection() {
  const products = useLoaderData<Product[]>();
  return (
    <section>
      {products?.length == 0 ? (
        <p className="py-3 text-lg">No products found in this collection</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
