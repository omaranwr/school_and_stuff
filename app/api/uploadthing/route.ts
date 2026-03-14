import { createRouteHandler } from "uploadthing/next";
import { postFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: postFileRouter,
});
