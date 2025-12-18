"use client";

import dynamic from "next/dynamic";
import { DocLayout } from "../../../src/components/doc-layout";

const ComponentDocsBadges = dynamic(
  () => import("../../../src/components/component-docs-badges").then((mod) => ({ default: mod.ComponentDocsBadges })),
  { ssr: false }
);

export default function ComponentsDocsLayout({ children }: { children: React.ReactNode }) {
  // Wrap all component docs pages in the same doc layout as Get Started pages
  return (
    <DocLayout>
      <ComponentDocsBadges />
      {children}
    </DocLayout>
  );
}


