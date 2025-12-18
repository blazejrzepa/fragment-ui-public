"use client";

import * as React from "react";
import clsx from "clsx";

export interface ResizableProps {
  children: React.ReactNode;
  defaultSize?: { width?: number; height?: number };
  minSize?: { width?: number; height?: number };
  maxSize?: { width?: number; height?: number };
  direction?: "horizontal" | "vertical" | "both";
  className?: string;
  onResize?: (size: { width: number; height: number }) => void;
}

export interface ResizableHandleProps {
  className?: string;
  disabled?: boolean;
}

export interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  defaultSizePx?: number; // Fixed pixel size instead of percentage
  minSizePx?: number; // Fixed pixel min size
  className?: string;
}

const ResizableContext = React.createContext<{
  direction: "horizontal" | "vertical" | "both";
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
}>({
  direction: "horizontal",
  isResizing: false,
  setIsResizing: () => {},
});

export const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  function Resizable(
    {
      children,
      defaultSize,
      minSize,
      maxSize,
      direction = "horizontal",
      className,
      onResize,
    },
    ref
  ) {
    const [isResizing, setIsResizing] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [size, setSize] = React.useState(defaultSize || { width: undefined, height: undefined });

    React.useEffect(() => {
      if (onResize && size.width !== undefined && size.height !== undefined) {
        onResize({ width: size.width, height: size.height });
      }
    }, [size, onResize]);

    return (
      <ResizableContext.Provider value={{ direction, isResizing, setIsResizing }}>
        <div
          ref={ref || containerRef}
          className={clsx(
            "relative",
            direction === "horizontal" && "flex flex-row",
            direction === "vertical" && "flex flex-col",
            isResizing && "select-none",
            className
          )}
          style={{
            width: size.width,
            height: size.height,
          }}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);

Resizable.displayName = "Resizable";

export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  function ResizableHandle({ className, disabled = false, ...props }, ref) {
    const { direction, isResizing, setIsResizing } = React.useContext(ResizableContext);
    const handleRef = React.useRef<HTMLDivElement>(null);
    const startPos = React.useRef<{ x: number; y: number } | null>(null);
    const prevPanelRef = React.useRef<HTMLElement | null>(null);
    const nextPanelRef = React.useRef<HTMLElement | null>(null);
    const containerRef = React.useRef<HTMLElement | null>(null);
    const startSizes = React.useRef<{ prev: number; next: number; container: number } | null>(null);

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        e.preventDefault();
        setIsResizing(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        const handle = (ref ? (ref as React.RefObject<HTMLDivElement>).current : handleRef.current);
        if (!handle) return;
        
        const container = handle.parentElement;
        if (!container) return;
        containerRef.current = container;
        
        // Find previous and next panels
        const siblings = Array.from(container.children);
        const handleIndex = siblings.indexOf(handle);
        prevPanelRef.current = handleIndex > 0 ? (siblings[handleIndex - 1] as HTMLElement) : null;
        nextPanelRef.current = handleIndex < siblings.length - 1 ? (siblings[handleIndex + 1] as HTMLElement) : null;
        
        if (prevPanelRef.current && nextPanelRef.current) {
          const containerSize = direction === "horizontal" ? container.offsetWidth : container.offsetHeight;
          const prevSize = direction === "horizontal" 
            ? prevPanelRef.current.offsetWidth 
            : prevPanelRef.current.offsetHeight;
          const nextSize = direction === "horizontal" 
            ? nextPanelRef.current.offsetWidth 
            : nextPanelRef.current.offsetHeight;
          
          startSizes.current = {
            prev: prevSize,
            next: nextSize,
            container: containerSize,
          };
        }
      },
      [disabled, setIsResizing, ref, direction]
    );

    React.useEffect(() => {
      if (!isResizing) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!startPos.current || !startSizes.current || !prevPanelRef.current || !nextPanelRef.current || !containerRef.current) return;

        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        if (direction === "horizontal") {
          const delta = deltaX;
          const newPrevSize = startSizes.current.prev + delta;
          const newNextSize = startSizes.current.next - delta;
          
          // Calculate percentages
          const prevPercent = (newPrevSize / startSizes.current.container) * 100;
          const nextPercent = (newNextSize / startSizes.current.container) * 100;
          
          // Apply min/max constraints from data attributes
          let prevMin = 0;
          let prevMax = 100;
          let nextMin = 0;
          let nextMax = 100;
          
          // Check for pixel-based min size
          if (prevPanelRef.current.dataset.minSizePx) {
            const minPx = parseFloat(prevPanelRef.current.dataset.minSizePx);
            prevMin = (minPx / startSizes.current.container) * 100;
          } else if (prevPanelRef.current.dataset.minSize) {
            prevMin = parseFloat(prevPanelRef.current.dataset.minSize);
          }
          
          if (prevPanelRef.current.dataset.maxSize) {
            prevMax = parseFloat(prevPanelRef.current.dataset.maxSize);
          }
          
          if (nextPanelRef.current.dataset.minSizePx) {
            const minPx = parseFloat(nextPanelRef.current.dataset.minSizePx);
            nextMin = (minPx / startSizes.current.container) * 100;
          } else if (nextPanelRef.current.dataset.minSize) {
            nextMin = parseFloat(nextPanelRef.current.dataset.minSize);
          }
          
          if (nextPanelRef.current.dataset.maxSize) {
            nextMax = parseFloat(nextPanelRef.current.dataset.maxSize);
          }
          
          const constrainedPrev = Math.max(prevMin, Math.min(prevMax, prevPercent));
          const constrainedNext = Math.max(nextMin, Math.min(nextMax, nextPercent));
          
          // If panel has defaultSizePx, use pixels instead of percentage when resizing
          const prevDefaultSizePx = prevPanelRef.current.dataset.defaultSizePx;
          const nextDefaultSizePx = nextPanelRef.current.dataset.defaultSizePx;
          
          if (prevDefaultSizePx) {
            // Convert percentage back to pixels for panels with defaultSizePx
            const prevPx = (constrainedPrev / 100) * startSizes.current.container;
            prevPanelRef.current.style.flex = `0 0 ${prevPx}px`;
          } else {
          prevPanelRef.current.style.flex = `0 0 ${constrainedPrev}%`;
          }
          
          if (nextDefaultSizePx) {
            // Convert percentage back to pixels for panels with defaultSizePx
            const nextPx = (constrainedNext / 100) * startSizes.current.container;
            nextPanelRef.current.style.flex = `0 0 ${nextPx}px`;
          } else {
          nextPanelRef.current.style.flex = `0 0 ${constrainedNext}%`;
          }
        }
        
        if (direction === "vertical") {
          const delta = deltaY;
          const newPrevSize = startSizes.current.prev + delta;
          const newNextSize = startSizes.current.next - delta;
          
          // Calculate percentages
          const prevPercent = (newPrevSize / startSizes.current.container) * 100;
          const nextPercent = (newNextSize / startSizes.current.container) * 100;
          
          // Apply min/max constraints from data attributes
          let prevMin = 0;
          let prevMax = 100;
          let nextMin = 0;
          let nextMax = 100;
          
          // Check for pixel-based min size
          if (prevPanelRef.current.dataset.minSizePx) {
            const minPx = parseFloat(prevPanelRef.current.dataset.minSizePx);
            prevMin = (minPx / startSizes.current.container) * 100;
          } else if (prevPanelRef.current.dataset.minSize) {
            prevMin = parseFloat(prevPanelRef.current.dataset.minSize);
          }
          
          if (prevPanelRef.current.dataset.maxSize) {
            prevMax = parseFloat(prevPanelRef.current.dataset.maxSize);
          }
          
          if (nextPanelRef.current.dataset.minSizePx) {
            const minPx = parseFloat(nextPanelRef.current.dataset.minSizePx);
            nextMin = (minPx / startSizes.current.container) * 100;
          } else if (nextPanelRef.current.dataset.minSize) {
            nextMin = parseFloat(nextPanelRef.current.dataset.minSize);
          }
          
          if (nextPanelRef.current.dataset.maxSize) {
            nextMax = parseFloat(nextPanelRef.current.dataset.maxSize);
          }
          
          const constrainedPrev = Math.max(prevMin, Math.min(prevMax, prevPercent));
          const constrainedNext = Math.max(nextMin, Math.min(nextMax, nextPercent));
          
          // If panel has defaultSizePx, use pixels instead of percentage when resizing
          const prevDefaultSizePx = prevPanelRef.current.dataset.defaultSizePx;
          const nextDefaultSizePx = nextPanelRef.current.dataset.defaultSizePx;
          
          if (prevDefaultSizePx) {
            // Convert percentage back to pixels for panels with defaultSizePx
            const prevPx = (constrainedPrev / 100) * startSizes.current.container;
            prevPanelRef.current.style.flex = `0 0 ${prevPx}px`;
          } else {
          prevPanelRef.current.style.flex = `0 0 ${constrainedPrev}%`;
          }
          
          if (nextDefaultSizePx) {
            // Convert percentage back to pixels for panels with defaultSizePx
            const nextPx = (constrainedNext / 100) * startSizes.current.container;
            nextPanelRef.current.style.flex = `0 0 ${nextPx}px`;
          } else {
          nextPanelRef.current.style.flex = `0 0 ${constrainedNext}%`;
          }
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        startPos.current = null;
        startSizes.current = null;
        prevPanelRef.current = null;
        nextPanelRef.current = null;
        containerRef.current = null;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isResizing, direction, setIsResizing, ref]);

    return (
      <div
        ref={ref || handleRef}
        className={clsx(
          "relative flex shrink-0 items-center justify-center",
          direction === "horizontal" && "w-[2px] cursor-col-resize",
          direction === "vertical" && "h-[2px] cursor-row-resize",
          direction === "both" && "w-[2px] h-[2px] cursor-nwse-resize",
          "bg-transparent",
          "hover:bg-[color:var(--color-fg-muted)]",
          "transition-colors duration-[var(--motion-duration-base)]",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <div
          className={clsx(
            "absolute",
            direction === "horizontal" && "h-8 w-1",
            direction === "vertical" && "h-1 w-8",
            direction === "both" && "h-8 w-8"
          )}
        />
      </div>
    );
  }
);

ResizableHandle.displayName = "ResizableHandle";

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  function ResizablePanel({ children, defaultSize, minSize, maxSize, defaultSizePx, minSizePx, className, ...props }, ref) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLElement | null>(null);
    const [computedSize, setComputedSize] = React.useState<number | undefined>(defaultSize);
    const [isMounted, setIsMounted] = React.useState(false);
    const { direction } = React.useContext(ResizableContext);

    // Calculate initial size immediately if defaultSizePx is provided
    React.useLayoutEffect(() => {
      if (!defaultSizePx) {
        setComputedSize(defaultSize);
        setIsMounted(true);
        return;
      }

      // When defaultSizePx is provided, don't calculate percentage - use pixels directly
      // This ensures the panel always starts at the exact pixel size
          setIsMounted(true);
    }, [defaultSizePx, defaultSize, ref]);

    return (
      <div
        ref={ref || panelRef}
        className={clsx("relative overflow-auto", className)}
        style={{
          // When defaultSizePx is provided, use fixed pixel width instead of percentage
          // This ensures the panel always starts at the exact pixel size
          flex: defaultSizePx ? `0 0 ${defaultSizePx}px` : (computedSize ? `0 0 ${computedSize}%` : "1 1 0%"),
          minWidth: direction === "horizontal" ? (minSize ? `${minSize}%` : minSizePx ? `${minSizePx}px` : undefined) : undefined,
          maxWidth: direction === "horizontal" ? (maxSize ? `${maxSize}%` : undefined) : undefined,
          minHeight: direction === "vertical" ? (minSize ? `${minSize}%` : minSizePx ? `${minSizePx}px` : undefined) : undefined,
          maxHeight: direction === "vertical" ? (maxSize ? `${maxSize}%` : undefined) : undefined,
          // Force width when defaultSizePx is set to ensure exact pixel size
          width: defaultSizePx && direction === "horizontal" ? `${defaultSizePx}px` : undefined,
          height: defaultSizePx && direction === "vertical" ? `${defaultSizePx}px` : undefined,
        }}
        data-min-size={minSize}
        data-max-size={maxSize}
        data-min-size-px={minSizePx}
        data-default-size-px={defaultSizePx}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResizablePanel.displayName = "ResizablePanel";

