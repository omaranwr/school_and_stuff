import { db } from "@/db";
import { image } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const postFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .input(
      z.object({
        adminPassword: z.string(),
        postId: z.number().nonoptional(),
      }),
    )
    .middleware(({ input }) => {
      if (
        !input.adminPassword ||
        input.adminPassword !== process.env.ADMIN_PASSWORD
      ) {
        throw new Error("Unauthorized");
      }
      return { ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { postId } = metadata;
      if (!postId) throw new Error("Post ID not returned from addAnswer");

      const length = await db
        .select({ count: count() })
        .from(image)
        .where(eq(image.postId, postId))
        .then((res) => res[0].count);

      await db.insert(image).values({
        url: file.ufsUrl,
        postId,
        order: length * 100,
      });
    }),
} satisfies FileRouter;

export type PostFileRouter = typeof postFileRouter;
