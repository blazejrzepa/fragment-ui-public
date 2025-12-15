"use client";

import Image from "next/image";
import * as React from "react";
import { Skeleton } from "@fragment_ui/ui";

interface DocImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Documentation image component with optimization and caption support
 */
export function DocImage({
  src,
  alt,
  width = 800,
  height = 600,
  caption,
  className,
  priority = false,
}: DocImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <figure className="my-6">
      <div className="relative overflow-hidden rounded-lg">
        {isLoading && (
          <Skeleton className="absolute inset-0" style={{ width, height }} />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-[color:var(--color-fg-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

