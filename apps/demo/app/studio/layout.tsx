import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fragment UI Studio",
  description: "AI-powered playground for generating React components",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

