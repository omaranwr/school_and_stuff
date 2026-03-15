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

function PostCarousel({
  images = [],
  eager = false,
}: {
  images?: {
    url: string;
    width: number | null;
    height: number | null;
    alt: string;
  }[];
  eager?: boolean;
}) {
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
            <CarouselItem key={index}>
              <div className="grid justify-center">
                <div className="overflow-hidden rounded-xl outline">
                  {image.height && image.width ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      className="max-h-128 w-min object-contain"
                      width={image.width!}
                      height={image.height!}
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-2 disabled:opacity-0 sm:p-5"
          variant={"secondary"}
        />
        <CarouselNext
          className="right-2 disabled:opacity-0 sm:p-5"
          variant={"secondary"}
        />
      </Carousel>
      <div className="grid justify-center">
        {current + 1} of {length}
      </div>
    </div>
  );
}

export default PostCarousel;
