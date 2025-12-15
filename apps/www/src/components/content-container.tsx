import React from "react";
import clsx from "clsx";

type ContentContainerProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Tailwind max-width class, e.g. "max-w-5xl"
   */
  maxWidthClass?: string;
};

export function ContentContainer({
  children,
  className,
  maxWidthClass = "max-w-[720px]",
}: ContentContainerProps) {
  return (
    <div className={clsx("w-full px-2 sm:px-4 lg:px-6", className)}>
      <div className={clsx("mx-auto w-full", maxWidthClass)}>{children}</div>
    </div>
  );
}


