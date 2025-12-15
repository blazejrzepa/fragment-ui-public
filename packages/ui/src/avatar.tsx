import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import clsx from "clsx";

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const Avatar = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
  >(function Avatar({ className, src, alt, fallback, ...props }, ref) {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={clsx(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className={clsx(
            "flex h-full w-full items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
          )}
        >
          {fallback || (alt?.[0]?.toUpperCase() ?? "?")}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  })
);

export { Avatar };

