/**
 * MDX Components Provider
 * 
 * This file provides React components that can be used in MDX files.
 * Components are automatically available in all MDX files without explicit imports.
 */

import { DocLayout } from "./doc-layout";
import { StorybookLink, EditOnGitHub } from "@fragment_ui/ui";

// Styled paragraph component for introduction text
export function StyledIntro({ children }: { children: React.ReactNode }) {
  return (
    <p 
      className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
      style={{
        fontFamily: "Geist, sans-serif",
        fontSize: "16px",
        fontStyle: "normal",
        lineHeight: "160%",
        color: "var(--foreground-secondary)",
      }}
    >
      {children}
    </p>
  );
}

// Styled paragraph component for body text with muted color
export function StyledText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "var(--color-fg-muted)",
        fontFamily: "Geist, sans-serif",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "160%",
      }}
    >
      {children}
    </p>
  );
}

// Export components that should be available in MDX files
export const MDXComponents = {
  DocLayout,
  StorybookLink,
  StyledIntro,
  StyledText,
  EditOnGitHub,
};

// Re-export for convenience
export { DocLayout, StorybookLink, EditOnGitHub };
