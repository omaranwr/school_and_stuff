"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function ImageThumbs({ files }: { files: File[] }) {
  return (
    <Carousel opts={{ align: "start" }} className="justify-start">
      <CarouselContent>
        {files.map((file, index) => {
          const preview = URL.createObjectURL(file);
          return (
            <CarouselItem key={index}>
              <img
                src={preview}
                alt={`Image number ${index}`}
                onLoad={() => URL.revokeObjectURL(preview)}
                className="max-h-30"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default ImageThumbs;
