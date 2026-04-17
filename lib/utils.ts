import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PostFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { useUploadThing } = generateReactHelpers<PostFileRouter>();

export const addArticle = (string: string) => {
  const words = string.split(" ");
  const articledWords = words.map((word) => {
    if (word[0] !== "و") return "ال" + word;
    if (word.length === 1) return word;
    return "وال" + word.slice(1);
  });
  return articledWords.join(" ");
};

export const getOrdinal = (number: number, articled: boolean = true) => {
  const firstTwenty = [
    "أول",
    "ثاني",
    "ثالث",
    "رابع",
    "خامس",
    "سادس",
    "سابع",
    "ثامن",
    "تاسع",
    "عاشر",
    "حادي عشر",
    "ثاني عشر",
    "ثالث عشر",
    "رابع عشر",
    "خامس عشر",
    "سادس عشر",
    "سابع عشر",
    "ثامن عشر",
    "تاسع عشر",
    "عشرون",
  ] as const;
  if (number <= 0 || number > 20) return "رقم: " + number;
  return `${articled && "ال"}${firstTwenty[number - 1]}`;
};

export const generateTitle = (
  subject?: string | null,
  week?: number | null,
  type?: string | null,
) => {
  const end = "للصف الأول الثانوي لغات 2026";
  const subjectAndWeek = `${subject ? addArticle(subject) : ""}${week ? " الأسبوع " + getOrdinal(week) : ""}`;
  if (!type) {
    if (!subject && !week)
      return "التقييمات والأداءات الأسبوعية للصف الأول الثانوي لغات 2026";
    return `تقييمات و أداءات ${subjectAndWeek} ${end}`;
  }
  let typedSubject = "";
  switch (type) {
    case "تقييم":
      typedSubject = `${!subject ? "ال" : ""}تقييمات ${subjectAndWeek}`;
      break;
    case "أداء منزلي":
      typedSubject = `${!subject ? "ال" : ""}أداءات ${subject ? addArticle(subject) : ""} المنزلية${week ? " الأسبوع " + getOrdinal(week) : ""}`;
      break;
    case "أداء صفي":
      typedSubject = `${!subject ? "ال" : ""}أداءات ${subject ? addArticle(subject) : ""} الصفية${week ? " الأسبوع " + getOrdinal(week) : ""}`;
      break;
  }
  return typedSubject + " " + end;
};
