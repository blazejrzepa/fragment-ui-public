import { DocLayout } from "../../../src/components/doc-layout";

export default function ComponentsDocsLayout({ children }: { children: React.ReactNode }) {
  // Wrap all component docs pages in the same doc layout as Get Started pages
  return <DocLayout>{children}</DocLayout>;
}


