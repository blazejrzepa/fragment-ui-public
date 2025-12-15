import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import clsx from "clsx";

export interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  ratio?: number;
  className?: string;
}

const AspectRatio = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AspectRatioPrimitive.Root>,
    AspectRatioProps
  >(function AspectRatio({ className, ratio = 16 / 9, ...props }, ref) {
    return (
      <AspectRatioPrimitive.Root
        ref={ref}
        ratio={ratio}
        className={clsx("relative w-full overflow-hidden", className)}
        {...props}
      />
    );
  })
);

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };

// Common aspect ratio presets
export const AspectRatioPresets = {
  square: 1,
  video: 16 / 9,
  photo: 4 / 3,
  portrait: 3 / 4,
  wide: 21 / 9,
  ultrawide: 32 / 9,
  story: 9 / 16,
} as const;

