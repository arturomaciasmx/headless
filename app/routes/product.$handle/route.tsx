import { Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { GridTileImage } from "~/components/grid/tile";
import ProductDescription from "~/components/product/description";
import Gallery from "~/components/product/gallery";
import { ProductProvider } from "~/components/product/product-context";
import { getProduct, getProductRecommentations } from "~/lib/shopify";
import type { Image, Product } from "~/lib/shopify/types";

export async function loader({ params }: { params: { handle: string } }) {
  const product = await getProduct({ handle: params.handle });
  if (product) {
    const recomendations = await getProductRecommentations(product.id);
    return { product, recomendations };
  }
  return null;
}

export default function ProductPage() {
  const { product } = useLoaderData<{ product: Product }>();
  if (product) {
    return (
      <ProductProvider>
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
            <div className="h-full w-full basis-full lg:basis-4/6">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden"></div>
                }
              >
                <Gallery
                  images={product.images.slice(0, 5).map((image: Image) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </Suspense>
            </div>
            <div className="basis-4 lg:basis-2/6">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>
          <RelatedProducts />
        </div>
      </ProductProvider>
    );
  } else {
    return null;
  }
}

export function RelatedProducts() {
  const { recomendations } = useLoaderData<{ recomendations: Product[] }>();
  if (!recomendations) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {recomendations.map((product: Product, index: number) => (
          <li
            key={index}
            className="aspect-square w-full flex-none min-[475]:w-1/2 md:w-1/4 lg:w-1/5"
          >
            <Link to={`/product/${product.handle}`} className="relative h-full w-full">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
