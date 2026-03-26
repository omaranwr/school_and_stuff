import { db } from "@/db";
import { image } from "@/db/schema";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sizeOf from "image-size";

const f = createUploadthing();

export const postFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "512KB", maxFileCount: 10 },
  })
    .input(
      z.object({
        adminPassword: z.string(),
        postId: z.number().nonoptional(),
      }),
    )
    .middleware(({ input, files }) => {
      if (
        !input.adminPassword ||
        input.adminPassword !== process.env.ADMIN_PASSWORD
      ) {
        throw new Error("Unauthorized");
      }
      return { ...input, names: files.map((file) => file.name) };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { postId } = metadata;
      if (!postId) throw new Error("Post ID not returned from addAnswer");

      const response = await fetch(file.ufsUrl);
      let dimensions = null;
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        dimensions = sizeOf(buffer);
      }

      const index = metadata.names.findIndex((name) => name === file.name);

      await db.insert(image).values({
        url: file.ufsUrl,
        postId,
        order: (index + 1) * 100,
        width: dimensions?.width,
        height: dimensions?.height,
      });
    }),
} satisfies FileRouter;

export type PostFileRouter = typeof postFileRouter;
