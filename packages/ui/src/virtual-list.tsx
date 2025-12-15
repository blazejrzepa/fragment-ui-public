"use client";

import * as React from "react";
import clsx from "clsx";

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  containerHeight?: number;
  overscan?: number;
  className?: string;
  containerClassName?: string;
  onScroll?: (scrollTop: number) => void;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * VirtualList - Efficiently renders large lists by only rendering visible items
 * Uses virtual scrolling to handle thousands of items without performance issues
 */
export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  containerHeight = 400,
  overscan = 5,
  className,
  containerClassName,
  onScroll,
  getItemKey,
}: VirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  // Calculate item heights
  const getItemHeight = React.useCallback(
    (index: number) => {
      if (typeof itemHeight === "function") {
        return itemHeight(index);
      }
      return itemHeight;
    },
    [itemHeight]
  );

  // Calculate cumulative heights for efficient range calculation
  const itemHeights = React.useMemo(() => {
    return items.map((_, index) => getItemHeight(index));
  }, [items, getItemHeight]);

  const cumulativeHeights = React.useMemo(() => {
    const cumulative: number[] = [];
    let sum = 0;
    for (let i = 0; i < itemHeights.length; i++) {
      cumulative.push(sum);
      sum += itemHeights[i];
    }
    cumulative.push(sum); // Total height
    return cumulative;
  }, [itemHeights]);

  const totalHeight = cumulativeHeights[cumulativeHeights.length - 1];

  // Calculate visible range
  const visibleRange = React.useMemo(() => {
    const start = scrollTop;
    const end = scrollTop + containerHeight;

    // Binary search for start index
    let startIndex = 0;
    let left = 0;
    let right = items.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midStart = cumulativeHeights[mid];
      const midEnd = cumulativeHeights[mid + 1];

      if (midEnd < start) {
        left = mid + 1;
      } else if (midStart > start) {
        right = mid - 1;
      } else {
        startIndex = mid;
        break;
      }
    }
    if (left > right) {
      startIndex = Math.max(0, Math.min(left, items.length - 1));
    }

    // Binary search for end index
    let endIndex = items.length - 1;
    left = 0;
    right = items.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midStart = cumulativeHeights[mid];
      const midEnd = cumulativeHeights[mid + 1];

      if (midEnd < end) {
        left = mid + 1;
      } else if (midStart > end) {
        right = mid - 1;
      } else {
        endIndex = mid;
        break;
      }
    }
    if (left > right) {
      endIndex = Math.max(0, Math.min(left, items.length - 1));
    }

    // Add overscan
    const visibleStart = Math.max(0, startIndex - overscan);
    const visibleEnd = Math.min(items.length - 1, endIndex + overscan);

    return { start: visibleStart, end: visibleEnd };
  }, [scrollTop, containerHeight, cumulativeHeights, items.length, overscan]);

  // Handle scroll
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  // Render visible items
  const visibleItems = React.useMemo(() => {
    const itemsToRender: Array<{ item: T; index: number; offset: number }> = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      itemsToRender.push({
        item: items[i],
        index: i,
        offset: cumulativeHeights[i],
      });
    }
    return itemsToRender;
  }, [items, visibleRange, cumulativeHeights]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "overflow-auto",
        containerClassName
      )}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        className={clsx("relative w-full", className)}
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index, offset }) => (
          <div
            key={getItemKey ? getItemKey(item, index) : index}
            style={{
              position: "absolute",
              top: offset,
              left: 0,
              right: 0,
              width: "100%",
              height: getItemHeight(index),
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

