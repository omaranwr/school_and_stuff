import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { postFileRouter } from "@/app/api/uploadthing/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DirectionProvider } from "@/components/ui/direction";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(postFileRouter)} />
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DirectionProvider direction="rtl">{children}</DirectionProvider>
        </ThemeProvider>
      </NuqsAdapter>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default Providers;
