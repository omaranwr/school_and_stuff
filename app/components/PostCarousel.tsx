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
import { shimmer, toBase64 } from "@/app/lib/constants";

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
                <div className="overflow-hidden lg:rounded-xl">
                  {image.height && image.width ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      className="max-h-128 w-max object-contain"
                      width={image.width}
                      height={image.height}
                      fill={!image.width}
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-2 hidden lg:flex lg:p-5"
          variant={"outline"}
        />
        <CarouselNext
          className="right-2 hidden lg:flex lg:p-5"
          variant={"outline"}
        />
      </Carousel>
      <div className="hidden justify-center lg:grid">
        {current + 1} of {length}
      </div>
    </div>
  );
}

export default PostCarousel;
