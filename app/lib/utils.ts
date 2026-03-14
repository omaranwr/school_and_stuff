import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PostFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { useUploadThing } = generateReactHelpers<PostFileRouter>();
