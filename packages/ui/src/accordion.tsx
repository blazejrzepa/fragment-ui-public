import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import clsx from "clsx";

const Accordion = AccordionPrimitive.Root;

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={clsx("border-b border-[color:var(--color-border-base)]", className)}
      suppressHydrationWarning
      {...props}
    />
  );
});

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  const id = React.useId();
  return (
    <AccordionPrimitive.Header className="flex mt-4 mb-4" suppressHydrationWarning id={id}>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={clsx(
          "flex flex-1 items-center justify-between pt-0 pb-0 text-base font-normal transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        suppressHydrationWarning
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 shrink-0 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      suppressHydrationWarning
      {...props}
    >
      <div className={clsx("pb-4 pt-0 text-[color:var(--color-fg-base)] font-light", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});

export { Accordion };

