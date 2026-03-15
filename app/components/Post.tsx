import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";

function Post({
  week,
  subject,
  content = "",
  weekSelected = false,
  subjectSelected = false,
  images = [],
}: {
  week: number;
  subject: string;
  content: string | null;
  weekSelected?: boolean;
  subjectSelected?: boolean;
  images?: {
    url: string;
    width: number | null;
    height: number | null;
    alt: string;
  }[];
}) {
  return (
    <Card size="sm">
      <CardContent>
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                {image.height && image.width ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    className="h-128 w-full object-contain"
                    width={image.width || undefined}
                    height={image.height || undefined}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-64 w-full object-contain"
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
        {content && <h2>{content}</h2>}
      </CardContent>
      {(!weekSelected || !subjectSelected) && (
        <CardFooter>
          <h3 className="text-muted-foreground text-sm">
            {!weekSelected && <div>week: {week}</div>}
            {!subjectSelected && <div>subject: {subject}</div>}
          </h3>
        </CardFooter>
      )}
    </Card>
  );
}

export default Post;
