import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

export const newValue = "new" as const;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
export const shimmerUrl = (w: number, h: number): PlaceholderValue =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;

export const weekParamName = "week";
export const subjectParamName = "subject";
export const typeParamName = "type";
export const selectedPostIdParamName = "post";
export const selectedImageIndexParamName = "index";

export const credits = [
  {
    name: "عمر حمام",
  },
  {
    name: "أدهم إيهاب",
  },
  {
    name: "إسماعيل طايل",
  },
  {
    name: "سيف الدين وليد",
  },
  {
    name: "عز الدين محمد",
  },
];

export const addArticle = (string: string) => {
  const words = string.split(" ");
  const articledWords = words.map((word) => {
    if (word[0] !== "و") return "ال" + word;
    if (word.length === 1) return word;
    return "وال" + word.slice(1);
  });
  return articledWords.join(" ");
};

export const generateTitle = (
  subject?: string | null,
  week?: number | null,
  type?: string | null,
) => {
  const end = "للصف الأول الثانوي لغات 2026";
  const subjectAndWeek = `${subject && addArticle(subject)}${week && " أسبوع " + week}`;
  if (!type) {
    if (!subject && !week)
      return "التقييمات والأداءات الأسبوعية للصف الأول الثانوي لغات 2026";
    return `تقييمات و أداءات ${subjectAndWeek} ${end}`;
  }
  let typedSubject = "";
  switch (type) {
    case "تقييم":
      typedSubject = `تقييمات ${subjectAndWeek}`;
      break;
    case "أداء منزلي":
      typedSubject = `أداءات ${subject && addArticle(subject)} المنزلية${week && " أسبوع " + week}`;
      break;
    case "أداء صفي":
      typedSubject = `أداءات ${subject && addArticle(subject)} الصفية${week && " أسبوع " + week}`;
      break;
  }
  return typedSubject + " " + end;
};
