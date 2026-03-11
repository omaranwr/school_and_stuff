import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { postFileRouter } from "@/uploadthing";
import { cn } from "@/app/lib/utils";
import Providers from "@/app/lib/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(postFileRouter)} />
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
