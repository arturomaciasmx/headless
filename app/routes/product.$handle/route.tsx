import { useLoaderData } from "@remix-run/react";
import Gallery from "~/components/product/gallery";
import { getProduct } from "~/lib/shopify";
import { Image, Product } from "~/lib/shopify/types";

export async function loader({ params }: { params: { handle: string } }) {
  const product = await getProduct({ handle: params.handle });
  console.log(product);
  return product;
}

export default function Product() {
  const product = useLoaderData<Product>();
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Gallery
            images={product?.images.slice(0, 5).map((image: Image) => ({
              src: image.url,
              altText: image.altText,
            }))}
          />
        </div>
        <div className="basis-4 lg:basis-2/6">
          <ProductDescription />
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
}
