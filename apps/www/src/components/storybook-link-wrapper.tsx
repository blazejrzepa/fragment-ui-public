"use client";

import * as React from "react";
import { StorybookLink as DSStorybookLink } from "@fragment_ui/ui";
import { getStorybookUrl } from "../lib/storybook";

/**
 * Wrapper component that uses StorybookLink from @fragment_ui/ui
 * with portal-specific Storybook URL configuration
 * 
 * Note: getStorybookUrl returns full URL with path, so we extract base URL
 */
export function StorybookLinkWrapper({
  path,
  children,
  className,
}: {
  path?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [baseUrl, setBaseUrl] = React.useState<string>("");

  React.useEffect(() => {
    // Calculate URL on client-side only
    const storybookUrl = getStorybookUrl();
    if (storybookUrl) {
      // Extract base URL from full URL
      try {
        const url = new URL(storybookUrl);
        setBaseUrl(`${url.protocol}//${url.host}`);
      } catch {
        // If URL parsing fails, use as-is
        setBaseUrl(storybookUrl);
      }
    }
  }, []);

  // Convert path format: "/docs/core-button--docs" -> "core-button--docs"
  const storybookPath = path?.startsWith("/docs/") 
    ? path.replace("/docs/", "")
    : path?.startsWith("/")
    ? path.slice(1)
    : path;

  return (
    <DSStorybookLink path={storybookPath} baseUrl={baseUrl} className={className}>
      {children}
    </DSStorybookLink>
  );
}

