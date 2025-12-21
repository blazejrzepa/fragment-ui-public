import "../src/styles/globals.css";
import "react-day-picker/dist/style.css";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "../src/components/theme-provider";
import { ComponentDisplayProvider } from "../src/components/component-display-provider";
import { ConditionalLayout } from "../src/components/conditional-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Fragment UI",
  description: "AI-native design system",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS variables - prevent FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --header-height: 60px;
              --max-width-container: 1536px;
              --sidebar-width: 240px;
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

