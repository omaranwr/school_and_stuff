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
  imageUrls = [],
}: {
  week: number;
  subject: string;
  content: string | null;
  showWeek?: boolean;
  showSubject?: boolean;
  imageUrls?: string[];
}) {
  return (
    <Card size="sm">
      <CardContent>
        <Carousel>
          <CarouselContent>
            {imageUrls.map((url, index) => (
              <CarouselItem key={index}>
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-64 w-full object-cover"
                />
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
