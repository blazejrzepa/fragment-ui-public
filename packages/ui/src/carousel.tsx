"use client";

import * as React from "react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

export interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  onSlideChange?: (index: number) => void;
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = false,
  className,
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, totalSlides]);

  // Handle slide change callback
  React.useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, onSlideChange]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("keydown", handleKeyDown);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, [totalSlides]);

  // Touch/swipe support
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleMouseEnter = () => {
    if (autoPlay) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsPaused(false);
    }
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
    >
      {/* Slides container */}
      <div className="relative overflow-hidden rounded-[var(--radius-md,12px)]">
        <div
          className="flex transition-transform duration-[var(--motion-duration-slower,500ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))]"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-[var(--space-2,8px)] top-1/2 -translate-y-1/2 z-10 rounded-full bg-[color:var(--color-surface-1)]/80 hover:bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)] p-[var(--space-2,8px)] shadow-[var(--shadow-md,0_4px_10px_rgba(0,0,0,.15))] transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5 text-[color:var(--color-fg-base)]" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-[var(--space-2,8px)] top-1/2 -translate-y-1/2 z-10 rounded-full bg-[color:var(--color-surface-1)]/80 hover:bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)] p-[var(--space-2,8px)] shadow-[var(--shadow-md,0_4px_10px_rgba(0,0,0,.15))] transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5 text-[color:var(--color-fg-base)]" />
          </button>
        </>
      )}

      {/* Dots pagination */}
      {showDots && totalSlides > 1 && (
        <div
          className="absolute bottom-[var(--space-4,16px)] left-1/2 -translate-x-1/2 z-10 flex gap-[var(--space-2,8px)]"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={clsx(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-[color:var(--color-brand-primary)] w-8"
                  : "bg-[color:var(--color-fg-muted)]/50 hover:bg-[color:var(--color-fg-muted)]"
              )}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

