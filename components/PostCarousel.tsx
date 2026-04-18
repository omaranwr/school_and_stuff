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
} from "@/lib/constants";
import { parseAsInteger, useQueryState } from "nuqs";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";

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
      <Carousel
        setApi={setApi}
        opts={{
          breakpoints: {
            "(min-width: 48rem)": {
              dragFree: false,
              containScroll: "keepSnaps",
            },
          },
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={`${images.length > 1 && "max-w-[80vw]"} md:max-w-full md:basis-full`}
            >
              <div
                className="border-secondary relative overflow-hidden md:rounded-xl"
                onClick={() => {
                  setPostId(image.postId);
                  setImageIndex(index);
                }}
              >
                <Skeleton className="absolute inset-0 rounded-none" />
                {image.height && image.width ? (
                  <AspectRatio
                    ratio={image.width / image.height}
                    className="max-h-128"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      className="object-contain"
                      width={image.width}
                      height={image.height}
                      blurDataURL={""}
                      loading={eager ? "eager" : "lazy"}
                    />
                  </AspectRatio>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="max-h-128 w-min object-contain"
                    loading={eager ? "eager" : "lazy"}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="inset-s-16! hidden md:flex"
          variant={"default"}
          size={"icon-lg"}
        />
        <CarouselNext
          className="inset-e-16! hidden md:flex"
          variant={"default"}
          size={"icon-lg"}
        />
      </Carousel>
      <div className="hidden justify-center lg:grid" dir="ltr">
        {current + 1} of {length}
      </div>
    </div>
  );
}

export default PostCarousel;
