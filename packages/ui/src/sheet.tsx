"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={clsx(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Enable scroll detection (detects when main page is at bottom)
   * @default false
   */
  scrollDetection?: boolean;
  /**
   * Enable wheel handling (redirects wheel events to Sheet content when main page is at bottom)
   * @default false
   */
  wheelHandling?: boolean;
  /**
   * CSS selector for the scrollable content element inside Sheet
   * If not provided, will look for the first scrollable element
   * @default undefined
   */
  scrollableSelector?: string;
};

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    { 
      side = "right", 
      className, 
      children, 
      scrollDetection = false,
      wheelHandling = false,
      scrollableSelector,
      ...props 
    },
    ref
  ) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const scrollableRef = React.useRef<HTMLElement | null>(null);
    const [isMainAtBottom, setIsMainAtBottom] = React.useState(false);

    // Combine refs
    React.useImperativeHandle(ref, () => contentRef.current as any);

    // Find scrollable element
    React.useEffect(() => {
      if (!contentRef.current) return;

      if (scrollableSelector) {
        scrollableRef.current = contentRef.current.querySelector(scrollableSelector);
      } else {
        // Find first scrollable element
        const findScrollable = (element: HTMLElement): HTMLElement | null => {
          const style = window.getComputedStyle(element);
          if (style.overflowY === "auto" || style.overflowY === "scroll") {
            return element;
          }
          for (const child of Array.from(element.children)) {
            if (child instanceof HTMLElement) {
              const found = findScrollable(child);
              if (found) return found;
            }
          }
          return null;
        };
        scrollableRef.current = findScrollable(contentRef.current);
      }
    }, [scrollableSelector, children]);

    // Check if main container is scrolled to bottom
    React.useEffect(() => {
      if (!scrollDetection) return;

      const handleScroll = () => {
        const threshold = 10; // 10px threshold
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const isAtBottom = scrollTop + windowHeight >= documentHeight - threshold;
        setIsMainAtBottom(isAtBottom);
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }, [scrollDetection]);

    // Redirect wheel events to Sheet content when at bottom
    React.useEffect(() => {
      if (!wheelHandling || !isMainAtBottom || !scrollableRef.current) return;

      const handleWheel = (e: WheelEvent) => {
        const scrollable = scrollableRef.current;
        if (!scrollable) return;

        // Check if scrollable can scroll
        const canScrollUp = scrollable.scrollTop > 0;
        const canScrollDown = scrollable.scrollTop < scrollable.scrollHeight - scrollable.clientHeight;

        // Only intercept if we're at bottom and scrollable can scroll
        if (isMainAtBottom && (canScrollUp || canScrollDown)) {
          const scrollingDown = e.deltaY > 0;
          const scrollingUp = e.deltaY < 0;

          const scrollableAtBottom = scrollable.scrollTop >= scrollable.scrollHeight - scrollable.clientHeight - 1;
          const scrollableAtTop = scrollable.scrollTop <= 1;

          // If scrolling down and scrollable is not at bottom, or scrolling up and scrollable is not at top
          if ((scrollingDown && !scrollableAtBottom) || (scrollingUp && !scrollableAtTop)) {
            e.preventDefault();
            scrollable.scrollTop += e.deltaY;
          }
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }, [isMainAtBottom, wheelHandling]);

    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
          ref={contentRef}
          className={clsx(
            "fixed z-50 gap-4 bg-[color:var(--color-surface-1)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            side === "top" &&
              "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            side === "bottom" &&
              "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            side === "left" &&
              "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
            side === "right" &&
              "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-[var(--radius-sm)] opacity-70 ring-offset-[color:var(--color-surface-1)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[color:var(--color-surface-2)]">
            ✕
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={clsx("text-lg font-semibold text-[color:var(--color-fg-base)]", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={clsx("text-sm text-[color:var(--color-fg-muted)]", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};


