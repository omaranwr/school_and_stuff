import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";
import Providers from "@/app/lib/providers";
import { Toaster } from "@/app/components/ui/sonner";

const rubik = Rubik({ variable: "--font-sans" });
const rubikArabic = Rubik({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "تقييمات وأداءات أولى ثانوي",
  description: "مجموعة تقييمات وأداءات لأولى ثانوي",
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
