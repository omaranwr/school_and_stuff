"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function ImageThumbs({ files }: { files: File[] }) {
  return (
    <Carousel className="justify-start">
      <CarouselContent>
        {files.map((file, index) => {
          const preview = URL.createObjectURL(file);
          const alt = file.name;
          return (
            <CarouselItem key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={alt}
                onLoad={() => URL.revokeObjectURL(preview)}
                className="max-h-40"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default ImageThumbs;
