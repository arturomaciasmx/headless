import { Link } from "@remix-run/react";
import { Product } from "~/lib/shopify/types";
import { GridTileImage } from "../grid/tile";
import Grid from "../grid";

export function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            to={`/product/${product.handle}`}
            className="relative inline-block h-full w-full"
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.images[0]?.url}
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
