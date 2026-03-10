import { createRouteHandler } from "uploadthing/next";
import { postFileRouter } from "@/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: postFileRouter,
});
