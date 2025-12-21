"use client";

import * as React from "react";
import clsx from "clsx";

export interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  leftWidth?: "1/3" | "1/2" | "2/3";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  reverse?: boolean;
}

/**
 * TwoColumnLayout - Scaffold for two-column page layouts
 * 
 * Provides a responsive two-column layout with configurable widths and gaps.
 */
export function TwoColumnLayout({
  left,
  right,
  className,
  leftWidth = "1/2",
  gap = 4,
  reverse = false,
}: TwoColumnLayoutProps) {
  const widthClasses = {
    "1/3": "md:w-1/3",
    "1/2": "md:w-1/2",
    "2/3": "md:w-2/3",
  };

  const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    7: "gap-7",
    8: "gap-8",
  };

  const leftColumn = (
    <div className={clsx("w-full", widthClasses[leftWidth])}>{left}</div>
  );
  const rightColumn = (
    <div className={clsx("w-full", "md:flex-1")}>{right}</div>
  );

  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row",
        gapClasses[gap],
        className
      )}
    >
      {reverse ? (
        <>
          {rightColumn}
          {leftColumn}
        </>
      ) : (
        <>
          {leftColumn}
          {rightColumn}
        </>
      )}
    </div>
  );
}

