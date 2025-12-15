"use client";

import Image from "next/image";
import * as React from "react";
import { Skeleton } from "@fragment_ui/ui";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * Optimized Image component using Next.js Image
 * Provides automatic image optimization, lazy loading, and modern formats
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes,
  fill = false,
  objectFit = "cover",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Handle external images - Next.js Image requires external domains to be configured
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  // For external images that aren't configured, use regular img with lazy loading
  if (isExternal && !src.includes("github.com")) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    );
  }

  // Use Next.js Image for optimized images
  if (fill) {
    return (
      <div className={`relative ${className || ""}`} style={{ width, height }}>
        {isLoading && (
          <Skeleton className="absolute inset-0" />
        )}
        {!hasError && (
          <Image
            src={src}
            alt={alt}
            fill
            className={className}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            sizes={sizes}
            style={{ objectFit }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            {...props}
          />
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-muted)]">
            {alt}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {isLoading && width && height && (
        <Skeleton className="absolute inset-0" style={{ width, height }} />
      )}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={className}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
      {hasError && (
        <div
          className={`flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-muted)] ${className || ""}`}
          style={{ width, height }}
        >
          {alt}
        </div>
      )}
    </div>
  );
}

