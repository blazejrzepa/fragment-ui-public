import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";

const Tabs = TabsPrimitive.Root;

type TabsVariant = "default" | "pills" | "underline" | "boxed";

const TabsContext = React.createContext<{ variant: TabsVariant }>({
  variant: "default",
});

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
  orientation?: "horizontal" | "vertical";
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(function TabsList({ className, variant = "default", orientation = "horizontal", ...props }, ref) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        ref={ref}
        className={clsx(
          "flex items-center",
          orientation === "horizontal"
            ? "inline-flex h-10 justify-center rounded-[var(--radius-md)] bg-[color:var(--color-surface-1)] p-1"
            : "flex-col h-auto w-auto items-stretch gap-1",
          variant === "pills" && "gap-1",
          variant === "underline" && "bg-transparent p-0 gap-6 border-b border-[color:var(--color-border-base)]",
          variant === "boxed" && "bg-transparent p-0 gap-1",
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
});

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: TabsVariant;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  iconOnly?: boolean;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ className, variant, icon, badge, iconOnly, children, ...props }, ref) {
  const context = React.useContext(TabsContext);
  const effectiveVariant = variant || context.variant;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
        iconOnly && "p-2 w-10 h-10",
        effectiveVariant === "default" &&
          "rounded-[var(--radius-sm)] px-3 py-1.5 data-[state=active]:bg-[color:var(--color-surface-2)] data-[state=active]:text-[color:var(--color-fg-base)]",
        effectiveVariant === "pills" &&
          "rounded-full px-4 py-1.5 data-[state=active]:bg-[color:var(--color-brand-primary)] data-[state=active]:text-white",
        effectiveVariant === "underline" &&
          "rounded-none px-1 py-2 border-b-2 border-transparent data-[state=active]:border-[color:var(--color-brand-primary)] data-[state=active]:text-[color:var(--color-brand-primary)] transition-colors relative",
        effectiveVariant === "boxed" &&
          "rounded-[var(--radius-sm)] px-4 py-2 border border-[color:var(--color-border-base)] data-[state=active]:border-[color:var(--color-brand-primary)] data-[state=active]:bg-[color:var(--color-brand-primary)] data-[state=active]:text-white",
        className
      )}
      {...props}
      aria-label={iconOnly ? children?.toString() : undefined}
    >
      {icon && <span className={clsx(!iconOnly && "mr-2")}>{icon}</span>}
      {!iconOnly && children}
      {badge && <span className={clsx(!iconOnly && "ml-2", "absolute -top-1 -right-1")}>{badge}</span>}
    </TabsPrimitive.Trigger>
  );
});

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={clsx(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        className
      )}
      {...props}
    />
  );
});

export { Tabs, TabsList, TabsTrigger, TabsContent };

