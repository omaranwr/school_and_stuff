import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

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
  const y = useMotionValue(0);
  const yPercentage = useTransform(
    y,
    (value) => 1 - Math.abs(value) / (window.screen.height / 3),
  );
  useEffect(() => {
    if (selectedImages.length > 0) y.set(0);
    console.log("no");
  }, [selectedImages, y]);
  return (
    <div
      className={`${selectedImages.length > 0 ? "fixed" : "hidden"} inset-0 touch-pinch-zoom lg:hidden`}
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
        >
          <CarouselContent className="h-full">
            {selectedImages.map((image, index) => (
              <CarouselItem key={index} className="basis-full">
                <motion.div
                  className="z-2"
                  drag="y"
                  dragDirectionLock={true}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(_, info) => {
                    if (Math.abs(y.get()) < 1) return;
                    if (
                      Math.abs(info.offset.y) > window.screen.height / 3 ||
                      info.velocity.y > 500
                    ) {
                      setClosed();
                      y.set(0);
                    }
                  }}
                  style={{ y }}
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
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default PopoverCarousel;
