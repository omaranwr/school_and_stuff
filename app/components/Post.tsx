import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import PostCarousel from "./PostCarousel";

function Post({
  week,
  subject,
  content = "",
  weekSelected = false,
  subjectSelected = false,
  eager = false,
  images = [],
}: {
  week: number;
  subject: string;
  content: string | null;
  weekSelected?: boolean;
  subjectSelected?: boolean;
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
          </h3>
        </CardFooter>
      )}
    </Card>
  );
}

export default Post;
