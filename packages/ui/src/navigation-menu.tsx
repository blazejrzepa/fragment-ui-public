"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const NavigationMenuContext = React.createContext<{ viewport: boolean }>({
  viewport: true,
});

export interface NavigationMenuProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  /**
   * Variant of the navigation menu
   * @default "default"
   * - "default": Standard navigation menu
   * - "header": Header variant with backdrop blur and fixed positioning
   */
  variant?: "default" | "header";
  /**
   * Enable backdrop blur effect (only applies when variant="header")
   * @default false
   */
  blur?: boolean;
  /**
   * Height of the header (only applies when variant="header")
   * @default "60px"
   */
  height?: string;
  /**
   * Maximum width of the container (only applies when variant="header")
   * @default "1536px"
   */
  maxWidth?: string;
  /**
   * Whether to render the Radix viewport (set false to align content under triggers like shadcn)
   * @default true
   */
  viewport?: boolean;
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, variant = "default", blur = false, height = "60px", maxWidth = "1536px", viewport = true, ...props }, ref) => {
  // Header variant with backdrop blur and fixed positioning
  if (variant === "header") {
    return (
      <header
        className={clsx("fixed top-0 left-0 right-0 z-50", className)}
        style={{
          height,
          backgroundColor: blur
            ? "color-mix(in oklab, var(--background-primary) 60%, transparent)"
            : "var(--background-primary)",
          backdropFilter: blur ? "blur(12px)" : "none",
          WebkitBackdropFilter: blur ? "blur(12px)" : "none",
        }}
      >
        <NavigationMenuContext.Provider value={{ viewport }}>
          <div className="mx-auto" style={{ maxWidth }}>
            <NavigationMenuPrimitive.Root
              ref={ref}
              className={clsx(
                "relative z-10 flex max-w-max flex-1 items-center justify-start",
                className
              )}
              {...props}
            >
              {children}
              {viewport !== false && <NavigationMenuViewport />}
            </NavigationMenuPrimitive.Root>
          </div>
        </NavigationMenuContext.Provider>
      </header>
    );
  }

  // Default variant
  return (
    <NavigationMenuContext.Provider value={{ viewport }}>
      <NavigationMenuPrimitive.Root
        ref={ref}
        className={clsx(
          "relative z-10 flex max-w-max flex-1 items-center justify-start",
          className
        )}
        {...props}
      >
        {children}
        {viewport !== false && <NavigationMenuViewport />}
      </NavigationMenuPrimitive.Root>
    </NavigationMenuContext.Provider>
  );
});
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={clsx(
      "group flex flex-1 list-none items-center justify-center space-x-2 [&>li]:list-none [&>li::marker]:hidden [&>li::marker]:content-none pl-0",
      className
    )}
    style={{ listStyle: "none" }}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    className={clsx(
      "relative list-none [&::marker]:hidden [&::marker]:content-none",
      className
    )}
    style={{ listStyle: "none", display: "list-item" }}
    {...props}
  />
));
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, style, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={clsx(
      "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-[color:var(--color-surface-1)] focus:bg-[color:var(--color-surface-1)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[color:var(--color-surface-1)] data-[state=open]:bg-[color:var(--color-surface-1)] text-[color:color-mix(in_oklab,var(--color-fg-base)_90%,transparent)] no-underline",
      className
    )}
    style={{
      textDecoration: "none",
      ...style,
    }}
    {...props}
  >
    {children}
    <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition-transform duration-300 group-data-[state=open]:rotate-180" />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
  const { viewport } = React.useContext(NavigationMenuContext);

  const viewportEnabledClasses =
    "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto";

  const inlineContentClasses =
    "absolute left-0 top-full z-[9999] w-full p-1.5 md:p-1.5 mt-1.5 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] shadow-lg duration-200 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:w-auto";

  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={clsx(
        viewport ? viewportEnabledClasses : inlineContentClasses,
        className
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

type NavigationMenuLinkVariant = "pill" | "unstyled";

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> & {
    /**
     * Visual style preset for the link.
     * - pill: default top-nav style (padding + hover/focus background)
     * - unstyled: minimal (no padding/hover bg) so consumers can fully control layout (e.g. “tile” links)
     */
    variant?: NavigationMenuLinkVariant;
  }
>(({ className, style, variant = "pill", ...props }, ref) => {
  const disabled = "disabled:pointer-events-none disabled:opacity-50";
  const text = "text-[color:color-mix(in_oklab,var(--color-fg-base)_90%,transparent)]";

  const pill =
    "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-[color:var(--color-surface-1)] focus:bg-[color:var(--color-surface-1)] focus:outline-none no-underline";

  // Minimal: no padding, no hover/focus background, no forced rounding/decoration.
  // Consumers can fully control layout + interaction styles.
  const unstyled = "group";

  return (
  <NavigationMenuPrimitive.Link
    ref={ref}
      className={clsx(text, disabled, variant === "pill" ? pill : unstyled, className)}
    style={{
      textDecoration: "none",
      ...style,
    }}
    {...props}
  />
  );
});
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updatePosition = () => {
      if (!wrapperRef.current) return;
      
      const wrapper = wrapperRef.current;
      const nav = wrapper.closest('[data-radix-navigation-menu-root]') as HTMLElement;
      if (!nav) return;

      // Find the active trigger (the one with data-state="open")
      const activeTrigger = nav.querySelector('[data-radix-navigation-menu-trigger][data-state="open"]') as HTMLElement;
      if (!activeTrigger) {
        // If no active trigger, position at left edge
        wrapper.style.setProperty("left", "0", "important");
        wrapper.style.setProperty("transform", "translateX(0)", "important");
        return;
      }

      // Use the inner relative container (Radix wraps the list in a relative div)
      const siblingRelative = wrapper.previousElementSibling as HTMLElement | null;
      const relativeContainer =
        (siblingRelative && getComputedStyle(siblingRelative).position === "relative"
          ? siblingRelative
          : (nav.querySelector('div[style*="position:relative"]') as HTMLElement | null)) || nav;

      const containerRect = relativeContainer.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      
      // Calculate left offset relative to the relative container
      const leftOffset = triggerRect.left - containerRect.left;
      
      // Position wrapper at trigger's left edge
      wrapper.style.setProperty("left", `${leftOffset}px`, "important");
      wrapper.style.setProperty("transform", "translateX(0)", "important");
      wrapper.style.setProperty("justify-content", "flex-start", "important");
    };

    // Initial positioning with delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePosition, 0);

    // Update on resize and scroll
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    
    // Use MutationObserver to watch for state changes
    const nav = wrapperRef.current?.closest('[data-radix-navigation-menu-root]');
    if (nav) {
      const observer = new MutationObserver(() => {
        // Small delay to ensure Radix UI has finished updating
        setTimeout(updatePosition, 10);
      });
      observer.observe(nav, {
        attributes: true,
        attributeFilter: ["data-state"],
        subtree: true,
      });

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
        observer.disconnect();
      };
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className={clsx("absolute left-0 top-full flex justify-start")} 
      style={{ 
        transform: "translateX(0)", 
        left: 0,
        justifyContent: "flex-start"
      }}
    >
      <NavigationMenuPrimitive.Viewport
        className={clsx(
          "origin-top-left relative mt-0.5 h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] max-w-full overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={clsx(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[color:var(--color-surface-1)] shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};


