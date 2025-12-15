"use client";

import Image from "next/image";
import * as React from "react";
import { Avatar } from "@fragment_ui/ui";
import clsx from "clsx";

interface OptimizedAvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: number;
  className?: string;
}

/**
 * Optimized Avatar component using Next.js Image
 * Falls back to standard Avatar if image fails or is not available
 */
export function OptimizedAvatar({
  src,
  alt,
  fallback,
  size = 40,
  className,
}: OptimizedAvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  // If no src or error, use standard Avatar
  if (!src || hasError) {
    return (
      <Avatar
        src={src}
        alt={alt}
        fallback={fallback}
        className={className}
      />
    );
  }

  // Check if external image domain is configured
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  const isConfiguredDomain =
    isExternal &&
    (src.includes("github.com") ||
      src.includes("githubusercontent.com") ||
      src.includes("vercel.com") ||
      src.includes("vercel.app"));

  // For unconfigured external domains, use standard Avatar
  if (isExternal && !isConfiguredDomain) {
    return (
      <Avatar
        src={src}
        alt={alt}
        fallback={fallback}
        className={className}
      />
    );
  }

  // Use Next.js Image for optimized avatars
  return (
    <div
      className={clsx(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt || ""}
        width={size}
        height={size}
        className="aspect-square h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
      {hasError && fallback && (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]">
          {fallback}
        </div>
      )}
    </div>
  );
}

