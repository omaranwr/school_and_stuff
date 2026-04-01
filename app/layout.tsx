import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";
import Providers from "@/app/lib/providers";
import { Toaster } from "@/app/components/ui/sonner";
import { credits } from "@/app/lib/constants";

const rubik = Rubik({ variable: "--font-sans" });
const rubikArabic = Rubik({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "تقييمات وأداءات أولى ثانوي",
  description:
    "مجموعة شاملة من التقييمات والأداءات لطلاب أولى ثانوي، تغطي جميع المواد الدراسية مع شروحات وافية وحلول مفصلة",
  keywords: [
    "تقييمات أولى ثانوي",
    "أداءات أولى ثانوي",
    "موارد تعليمية",
    "امتحانات",
    "اختبارات أولى ثانوي",
    "تقييمات مدرسية",
  ],
  authors: [...credits, { name: "عمر أنور" }],
  openGraph: {
    title: "تقييمات وأداءات أولى ثانوي",
    description:
      "موارد تعليمية شاملة لطلاب أولى ثانوي تتضمن تقييمات وأداءات شاملة",
    url: "https://school-assessments.vercel.app",
    siteName: "تقييمات أولى ثانوي",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "تقييمات وأداءات أولى ثانوي",
    description:
      "موارد تعليمية شاملة لطلاب أولى ثانوي مع تقييمات وأداءات مفصلة",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://school-assessments.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("font-sans", rubik.variable, rubikArabic.variable)}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
