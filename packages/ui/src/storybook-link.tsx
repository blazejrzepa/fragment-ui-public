"use client";

import * as React from "react";

export interface StorybookLinkProps {
  /**
   * Storybook path (e.g., "components-button--default")
   */
  path?: string;
  /**
   * Base URL for Storybook
   * @default process.env.NEXT_PUBLIC_STORYBOOK_URL or empty string
   */
  baseUrl?: string;
  /**
   * Link content
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * StorybookLink - Component that conditionally renders Storybook link
 * Only shows link if Storybook URL is configured
 * 
 * @example
 * ```tsx
 * <StorybookLink path="components-button--default" baseUrl="https://storybook.example.com">
 *   View in Storybook
 * </StorybookLink>
 * ```
 */
export function StorybookLink({
  path,
  baseUrl,
  children,
  className,
}: StorybookLinkProps) {
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    // Calculate URL on client-side only
    const storybookBaseUrl = baseUrl || (typeof window !== "undefined" ? (window as any).__STORYBOOK_URL__ : "") || "";
    const storybookUrl = path && storybookBaseUrl
      ? `${storybookBaseUrl.replace(/\/$/, "")}/?path=/story/${path}`
      : "";

    setUrl(storybookUrl);
  }, [path, baseUrl]);

  if (!url) {
    return null; // Don't render link if Storybook URL is not configured
  }

  return (
    <a
      href={url}
      className={className || "text-[color:var(--color-brand-primary)]"}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || "Storybook"}
    </a>
  );
}

