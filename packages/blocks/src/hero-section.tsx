"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import { Link } from "./link-helper";
import clsx from "clsx";

export interface HeroCTA {
  label: string;
  action?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
}

export interface HeroSectionProps {
  title: string;
  description?: string;
  primaryCTA?: HeroCTA;
  secondaryCTA?: HeroCTA;
  background?: "gradient" | "image" | "solid";
  image?: {
    src: string;
    alt: string;
  };
  className?: string;
}

export function HeroSection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  background = "solid",
  image,
  className,
}: HeroSectionProps) {
  const backgroundClasses = clsx({
    "bg-gradient-to-r from-[color:var(--color-brand-primary)] to-[color:var(--color-brand-secondary)]":
      background === "gradient",
    "bg-[color:var(--color-surface-1)]": background === "solid",
    "bg-cover bg-center": background === "image" && image,
  });

  return (
    <section
      className={clsx(
        "py-16 md:py-24 text-center",
        backgroundClasses,
        className
      )}
      style={
        background === "image" && image
          ? { backgroundImage: `url(${image.src})` }
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[color:var(--color-fg-base)]">
            {title}
          </h1>
          {description && (
            <p className="text-xl md:text-2xl text-[color:var(--color-fg-muted)] mb-8">
              {description}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCTA && (
                primaryCTA.href ? (
                  <Link href={primaryCTA.href}>
                    <Button
                      variant={primaryCTA.variant || "solid"}
                      size="lg"
                      data-action-id={primaryCTA.action}
                      data-action-kind="primaryCTA"
                    >
                      {primaryCTA.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={primaryCTA.variant || "solid"}
                    size="lg"
                    onClick={primaryCTA.onClick}
                    data-action-id={primaryCTA.action}
                    data-action-kind="primaryCTA"
                  >
                    {primaryCTA.label}
                  </Button>
                )
              )}
              {secondaryCTA && (
                secondaryCTA.href ? (
                  <Link href={secondaryCTA.href}>
                    <Button
                      variant={secondaryCTA.variant || "outline"}
                      size="lg"
                      data-action-id={secondaryCTA.action}
                      data-action-kind="secondaryCTA"
                    >
                      {secondaryCTA.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={secondaryCTA.variant || "outline"}
                    size="lg"
                    onClick={secondaryCTA.onClick}
                    data-action-id={secondaryCTA.action}
                    data-action-kind="secondaryCTA"
                  >
                    {secondaryCTA.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

