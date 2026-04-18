"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import PopoverCarousel from "./PopoverCarousel";
import { useState } from "react";

function ImageThumbs({ files }: { files: File[] }) {
  const images = files.map((file, index) => ({
    src: file,
    alt: `${file.name} (${index + 1})`,
  }));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <>
      <Carousel className="justify-start">
        <CarouselContent>
          {images.map(({ src, alt }, index) => {
            const preview = URL.createObjectURL(src);
            return (
              <CarouselItem key={index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={alt}
                  className="max-h-40"
                  onLoad={() => URL.revokeObjectURL(preview)}
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsPopoverOpen(true);
                  }}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <PopoverCarousel
        imageIndex={selectedIndex}
        selectedImages={
          isPopoverOpen
            ? images.map(({ src, alt }) => {
                const preview = URL.createObjectURL(src);
                return {
                  alt: alt,
                  src: preview,
                  onLoad: () => URL.revokeObjectURL(preview),
                };
              })
            : []
        }
        onExitComplete={() => setIsPopoverOpen(false)}
      />
    </>
  );
}

export default ImageThumbs;
