import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "../grid/tile";
import { useProduct, useUpdateURL } from "./product-context";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <img
            className="h-full w-full object-contain"
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={images[imageIndex].src as string}
            alt={images[imageIndex].altText as string}
            fetchPriority="high"
          />
        )}
        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <button aria-label="Previous product image" className={buttonClassName}>
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button className={buttonClassName} aria-label="Next product image">
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            return (
              <li key={index} className="h-20 w-20">
                <button aria-label="Select product image" className="h-full w-full">
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    active={isActive}
                    width={80}
                    height={80}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
