"use client";

import * as React from "react";
import Link from "next/link";

export interface LogoProps {
  variant?: "light" | "dark" | "auto";
  showText?: boolean;
  className?: string;
  href?: string;
  imageClassName?: string;
}

export function Logo({
  variant = "auto",
  showText = true,
  className = "",
  href = "/",
  imageClassName = "",
}: LogoProps) {
  const iconSize = imageClassName ? 20 : 16;

  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/logo/fragment-ui.svg"
        alt="Fragment UI"
        className={imageClassName || "h-[16px] w-[16px]"}
        style={{ 
          width: `${iconSize}px`, 
          height: `${iconSize}px`,
        }}
      />
      {showText && <span className="text-xl font-semibold">Fragment UI</span>}
    </Link>
  );
}

