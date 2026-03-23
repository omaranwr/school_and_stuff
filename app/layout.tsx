import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";
import Providers from "@/app/lib/providers";
import { Toaster } from "@/app/components/ui/sonner";

const notoSans = Noto_Sans({ variable: "--font-sans" });
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Answered school assessments",
  description: "Hopefully soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", notoSans.variable, notoSansArabic.variable)}
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
