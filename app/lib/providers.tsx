import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { postFileRouter } from "@/app/api/uploadthing/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(postFileRouter)} />
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </NuqsAdapter>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default Providers;
