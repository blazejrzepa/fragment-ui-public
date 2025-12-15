"use client";

import { getStorybookUrl } from "../lib/storybook";
import { useEffect, useState } from "react";

interface StorybookLinkProps {
  path?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Component that conditionally renders Storybook link
 * Only shows link if Storybook URL is configured
 * Uses useState to ensure URL is calculated on client-side only
 */
export function StorybookLink({ path, children, className }: StorybookLinkProps) {
  // Use useState to ensure URL is calculated on client-side only
  // This prevents SSR issues where URL might be different
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Calculate URL on client-side only
    const storybookUrl = getStorybookUrl(path);
    setUrl(storybookUrl || "");
  }, [path]);
  
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

