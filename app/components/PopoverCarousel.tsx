import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";

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
  return (
    <div
      className={`${selectedImages.length > 0 ? "fixed" : "hidden"} bg-popover inset-0 touch-pinch-zoom lg:hidden`}
    >
      <Button
        size={"icon-xs"}
        variant={"outline"}
        className="absolute inset-s-5 inset-bs-5 z-1"
        onClick={() => setClosed()}
      >
        <X />
      </Button>
      <div className="flex h-full w-full items-center justify-center">
        <Carousel opts={{ dragFree: false, startIndex: imageIndex }}>
          <CarouselContent>
            {selectedImages.map((image, index) => (
              <CarouselItem key={index} className="basis-full">
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default PopoverCarousel;
