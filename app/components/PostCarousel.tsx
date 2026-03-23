"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import {
  selectedImageIndexParamName,
  selectedPostIdParamName,
  shimmer,
  toBase64,
} from "@/app/lib/constants";
import { parseAsInteger, useQueryState } from "nuqs";

function PostCarousel({
  images = [],
  eager = false,
}: {
  images?: {
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
    alt: string;
  }[];
  eager?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_postId, setPostId] = useQueryState(
    selectedPostIdParamName,
    parseAsInteger,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_imageIndex, setImageIndex] = useQueryState(
    selectedImageIndexParamName,
    parseAsInteger,
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const length = api?.scrollSnapList().length;
  useEffect(() => {
    api?.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <div className="grid gap-1">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={`${images.length > 1 && "max-w-[80vw]"} lg:max-w-full`}
            >
              <div
                className="border-secondary overflow-hidden lg:rounded-xl lg:border-4"
                onClick={() => {
                  if (window.matchMedia("(min-width: 64rem)").matches) return;
                  setPostId(image.postId);
                  setImageIndex(index);
                }}
              >
                {image.height && image.width ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    className="max-h-128 w-min object-contain"
                    width={image.width}
                    height={image.height}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(image.width, image.width))}`}
                    loading={eager ? "eager" : "lazy"}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-128 w-min object-contain"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="inset-s-16! left-0 hidden lg:flex"
          variant={"default"}
          size={"icon-lg"}
        />
        <CarouselNext
          className="inset-e-16! right-0 hidden lg:flex"
          variant={"default"}
          size={"icon-lg"}
        />
      </Carousel>
      <div className="hidden justify-center lg:grid">
        {current + 1} of {length}
      </div>
    </div>
  );
}

export default PostCarousel;
