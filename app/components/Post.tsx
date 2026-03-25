import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import PostCarousel from "./PostCarousel";

function Post({
  week,
  subject,
  type,
  content = "",
  weekSelected = false,
  subjectSelected = false,
  typeSelected = false,
  eager = false,
  images = [],
}: {
  week: number;
  subject: string;
  type?: string | null;
  content: string | null;
  weekSelected?: boolean;
  subjectSelected?: boolean;
  typeSelected?: boolean;
  eager?: boolean;
  images?: {
    postId: number;
    url: string;
    width: number | null;
    height: number | null;
    alt: string;
  }[];
}) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="grid gap-4">
          <PostCarousel images={images} eager={eager} />
          {content && <h2 className="text-xl">{content}</h2>}
        </div>
      </CardContent>
      {(!weekSelected || !subjectSelected) && (
        <CardFooter>
          <h3 className="text-muted-foreground text-sm">
            {!weekSelected && <div>أسبوع: {week}</div>}
            {!subjectSelected && <div>المادة: {subject}</div>}
            {!typeSelected && type && <div>النوع: {type}</div>}
          </h3>
        </CardFooter>
      )}
    </Card>
  );
}

export default Post;
