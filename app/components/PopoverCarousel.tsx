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
import {
  RefObject,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import PrismaZoom from "react-prismazoom";

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

  const [showBar, setShowBar] = useState<boolean>(true);
  const wasPointerDown = useRef<boolean>(false);

  const y = useMotionValue(0);
  const yPercentage = useTransform(
    y,
    (value) => 1 - Math.abs(value) / (screenHeight / 3),
  );

  useEffect(() => {
    if (selectedImages.length > 0) y.set(0);
  }, [selectedImages, y]);

  return (
    <motion.div
      className={`${selectedImages.length > 0 ? "fixed" : "hidden"} inset-0 touch-none lg:hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0.1,
          duration: 0.1,
        },
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <motion.div
        className="bg-popover fixed inset-0"
        style={{ opacity: yPercentage }}
      />
      <motion.div style={{ opacity: yPercentage }} className="z-50 relative">
        <motion.div animate={{ opacity: showBar ? 1 : 0 }}>
          <Button
            size={"icon-xs"}
            variant={"outline"}
            className="absolute inset-s-5 inset-bs-5"
            onClick={() => setClosed()}
          >
            <X />
          </Button>
        </motion.div>
      </motion.div>
      <div className="flex h-full w-full justify-center">
        <Carousel
          onPointerDown={() => {
            wasPointerDown.current = true;
          }}
          onPointerUp={() => {
            if (!wasPointerDown.current) return;
            setShowBar((s) => !s);
          }}
          opts={{ dragFree: false, startIndex: imageIndex, dragThreshold: 3 }}
          className="h-full"
          setApi={setApi}
        >
          <PopoverCarouselInner
            selectedImages={selectedImages}
            setClosed={setClosed}
            api={api}
            y={y}
            setShowBar={setShowBar}
            wasPointerDown={wasPointerDown}
            setWasPointerDown={(value) => (wasPointerDown.current = value)}
          />
        </Carousel>
      </div>
    </motion.div>
  );
}

function PopoverCarouselInner({
  selectedImages,
  setClosed,
  api,
  y,
  setShowBar,
  setWasPointerDown,
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
  setShowBar: Dispatch<SetStateAction<boolean>>;
  wasPointerDown: RefObject<boolean>;
  setWasPointerDown: (val: boolean) => void;
}) {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    let destroyed = false;

    api?.on("select", () => {
      if (destroyed) return;
      setIsTransitioning(true);
    });
    api?.on("settle", () => {
      if (destroyed) return;
      setIsTransitioning(false);
    });
    api?.on("scroll", (emblaApi) => {
      if (destroyed) return;
      const settlePixelThreshold = 50;
      const { dragHandler, location, target } = emblaApi.internalEngine();
      if (dragHandler.pointerDown()) {
        setWasPointerDown(false);
        setIsTransitioning(true);
        return;
      }

      const displacement = target.get() - location.get();
      if (Math.abs(displacement) < settlePixelThreshold) {
        setIsTransitioning(false);
        return;
      }

      setWasPointerDown(false);
      setIsTransitioning(true);
    });

    return () => {
      destroyed = true;
    };
  }, [api, setWasPointerDown]);

  useEffect(() => {
    api?.reInit({ watchDrag: !isZoomed });
  }, [isZoomed, api]);

  return (
    <motion.div
      className="z-2 flex items-center"
      drag="y"
      dragListener={!isTransitioning && !isZoomed}
      dragDirectionLock
      dragTransition={{ bounceStiffness: 700, bounceDamping: 50 }}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (Math.abs(y.get()) < 1) return;
        if (
          Math.abs(info.offset.y) > screenHeight / 3 ||
          info.velocity.y > 500
        ) {
          y.stop();
          setClosed();
        }
      }}
      style={{ y }}
    >
      <CarouselContent className="h-full">
        {selectedImages.map((image, index) => (
          <CarouselItem key={index} className="basis-full">
            <PopoverCarouselItem
              image={image}
              isTransitioning={isTransitioning}
              isZoomed={isZoomed}
              setIsZoomed={setIsZoomed}
              setShowBar={setShowBar}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </motion.div>
  );
}

function PopoverCarouselItem({
  image,
  isTransitioning,
  isZoomed,
  setIsZoomed,
  setShowBar,
}: {
  image: {
    alt: string;
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
  };
  isTransitioning: boolean;
  isZoomed: boolean;
  setIsZoomed: Dispatch<SetStateAction<boolean>>;
  setShowBar: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <PrismaZoom
      allowZoom={!isTransitioning}
      onZoomChange={(zoom) => {
        if (!isZoomed && zoom > 1) setShowBar(false);
        else if (zoom <= 1) setShowBar(true);
        setIsZoomed(zoom > 1);
      }}
    >
      {image.width && image.height ? (
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-svh max-w-full object-contain"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.url}
          alt={image.alt}
          className="max-h-svh max-w-full object-contain"
        />
      )}
    </PrismaZoom>
  );
}

export default PopoverCarousel;
