import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import Grid from "~/components/grid";
import { ProductGridItems } from "~/components/layout/product-grid-items";
import { defaultSort, sorting } from "~/lib/constants";
import { getCollectionProducts } from "~/lib/shopify";
import { Product } from "~/lib/shopify/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { sort, collection } = params;
  const { sortKey, reverse } = sorting.find((item) => item.slug == sort) || defaultSort;
  if (collection) {
    const products = await getCollectionProducts({
      collection,
      sortKey,
      reverse,
    });
    console.log(products);

    return products;
  }
  return [];
}

export default function SearchCollection() {
  const products = useLoaderData<typeof loader>();
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
