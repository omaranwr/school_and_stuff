import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { postFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/app/lib/utils";
import Providers from "@/app/lib/providers";
import { Toaster } from "@/app/components/ui/sonner";

const notoSans = Noto_Sans({ variable: "--font-sans" });

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
      className={cn("font-sans", notoSans.variable)}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(postFileRouter)} />
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
