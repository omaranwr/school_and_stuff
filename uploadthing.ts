import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const postFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async () => {
    return { status: "success" } as const;
  }),
} satisfies FileRouter;

export type PostFileRouter = typeof postFileRouter;
