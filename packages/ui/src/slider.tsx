"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import clsx from "clsx";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string;
}

const Slider = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
  >(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={clsx(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
      <SliderPrimitive.Range className="absolute h-full bg-[color:var(--color-brand-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-1)] ring-offset-[color:var(--color-surface-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };


