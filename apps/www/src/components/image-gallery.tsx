"use client";

import * as React from "react";
import { OptimizedImage } from "./optimized-image";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Optimized image gallery component
 * Uses lazy loading and responsive images
 */
export function ImageGallery({
  images,
  className,
  columns = 3,
}: ImageGalleryProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={clsx("grid gap-4", gridCols[columns], className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index < 3} // Load first 3 images with priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

