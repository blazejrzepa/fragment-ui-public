import "../src/styles/globals.css";
import "react-day-picker/dist/style.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../src/components/theme-provider";
import { ComponentDisplayProvider } from "../src/components/component-display-provider";
import { ConditionalLayout } from "../src/components/conditional-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Fragment UI",
  description: "AI-native design system",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: "/assets/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icons/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/assets/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/assets/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "android-chrome", url: "/assets/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS to prevent FOUC - sidebar positioning */}
        <style dangerouslySetInnerHTML={{
          __html: `
            aside.fixed.left-0,
            aside[class*="fixed"][class*="left-0"],
            aside.fixed.left-0[class*="z-30"],
            aside.fixed[class*="w-64"] {
              left: 0 !important;
              margin-left: 0 !important;
              padding-left: 0 !important;
              transform: translateX(0) !important;
              inset: 0px auto auto 0px !important;
            }
          `
        }} />
      </head>
      <body>
        <ThemeProvider>
          <ComponentDisplayProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </ComponentDisplayProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

