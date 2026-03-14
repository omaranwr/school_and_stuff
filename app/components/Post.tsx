import { Card, CardContent, CardFooter } from "@/app/components/ui/card";

function Post({
  week,
  subject,
  content = "",
  showWeek = true,
  showSubject = true,
}: {
  week: number;
  subject: string;
  content?: string;
  showWeek?: boolean;
  showSubject?: boolean;
}) {
  return (
    <Card size="sm">
      {content && <CardContent>{content}</CardContent>}
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
