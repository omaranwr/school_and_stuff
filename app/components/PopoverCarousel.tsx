"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import Image from "next/image";
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

const screenHeight = typeof window !== "undefined" ? window.screen.height : 1;

function PopoverCarousel({
  selectedImages,
  imageIndex,
  setClosed,
}: {
  selectedImages: {
    alt: string;
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
  }[];
  imageIndex: number;
  setClosed: () => void;
}) {
  const [api, setApi] = useState<CarouselApi>();

  const y = useMotionValue(0);
  const yPercentage = useTransform(
    y,
    (value) => 1 - Math.abs(value) / (screenHeight / 3),
  );

  useEffect(() => {
    if (selectedImages.length > 0) y.set(0);
  }, [selectedImages, y]);

  return (
    <div
      className={`${selectedImages.length > 0 ? "fixed" : "hidden"} inset-0 touch-none lg:hidden`}
    >
      <motion.div
        className="bg-popover fixed inset-0"
        style={{ opacity: yPercentage }}
      />
      <Button
        size={"icon-xs"}
        variant={"outline"}
        className="absolute inset-s-5 inset-bs-5 z-1"
        onClick={() => setClosed()}
      >
        <X />
      </Button>
      <div className="flex h-full w-full justify-center">
        <Carousel
          opts={{ dragFree: false, startIndex: imageIndex }}
          className="h-full"
          setApi={setApi}
        >
          <PopoverCarouselInner
            selectedImages={selectedImages}
            setClosed={setClosed}
            api={api}
            y={y}
          />
        </Carousel>
      </div>
    </div>
  );
}

function PopoverCarouselInner({
  selectedImages,
  setClosed,
  api,
  y,
}: {
  selectedImages: {
    alt: string;
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
  }[];
  setClosed: () => void;
  api: CarouselApi;
  y: MotionValue;
}) {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    api?.on("select", () => setIsTransitioning(true));
    api?.on("settle", () => setIsTransitioning(false));
    api?.on("scroll", (emblaApi) => {
      const settlePixelThreshold = 50;
      const { dragHandler, location, target } = emblaApi.internalEngine();
      if (dragHandler.pointerDown()) {
        setIsTransitioning(true);
        return;
      }

      const displacement = target.get() - location.get();
      if (Math.abs(displacement) < settlePixelThreshold) {
        setIsTransitioning(false);
        return;
      }

      setIsTransitioning(true);
    });
  }, [api]);

  return (
    <motion.div
      className="z-2 flex items-center"
      drag="y"
      dragListener={!isTransitioning}
      dragDirectionLock={true}
      dragTransition={{ bounceStiffness: 700, bounceDamping: 40 }}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (Math.abs(y.get()) < 1) return;
        if (
          Math.abs(info.offset.y) > screenHeight / 3 ||
          info.velocity.y > 500
        ) {
          setClosed();
          y.set(0);
        }
      }}
      style={{ y }}
    >
      <CarouselContent className="h-full">
        {selectedImages.map((image, index) => (
          <CarouselItem key={index} className="basis-full">
            <PopoverCarouselItem image={image} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </motion.div>
  );
}

function PopoverCarouselItem({
  image,
}: {
  image: {
    alt: string;
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
  };
}) {
  if (image.width && image.height) {
    return (
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="max-h-svh max-w-full object-contain"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.alt}
      className="max-h-svh max-w-full object-contain"
    />
  );
}

export default PopoverCarousel;
