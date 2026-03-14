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
  showWeek = true,
  showSubject = true,
  images = [],
}: {
  week: number;
  subject: string;
  content: string | null;
  showWeek?: boolean;
  showSubject?: boolean;
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
                    className="h-64 w-full object-cover"
                    width={image.width || undefined}
                    height={image.height || undefined}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-64 w-full object-cover"
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {content}
      </CardContent>
      {(showWeek || showSubject) && (
        <CardFooter>
          <h3 className="text-muted-foreground text-sm">
            {showWeek && <div>week: {week}</div>}
            {showSubject && <div>subject: {subject}</div>}
          </h3>
        </CardFooter>
      )}
    </Card>
  );
}

export default Post;
