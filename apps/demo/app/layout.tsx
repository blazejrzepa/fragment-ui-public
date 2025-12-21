import "../src/styles/globals.css";
import type { Metadata } from "next";
import { ComponentDisplayProvider } from "@/components/component-display-provider";

export const metadata: Metadata = {
  title: "Fragment UI Studio",
  description: "AI-powered playground for generating and editing React components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ComponentDisplayProvider>
          {/* Full-screen layout for playground, constrained for other pages */}
          <div className="playground-layout">{children}</div>
        </ComponentDisplayProvider>
      </body>
    </html>
  );
}

