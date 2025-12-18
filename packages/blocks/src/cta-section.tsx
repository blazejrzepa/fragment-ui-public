"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import Link from "next/link";
import clsx from "clsx";

export interface CTAAction {
  label: string;
  action?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
}

export interface CTASectionProps {
  title?: string;
  description?: string;
  primaryCTA?: CTAAction;
  secondaryCTA?: CTAAction;
  variant?: "centered" | "split";
  background?: "solid" | "gradient" | "muted";
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "centered",
  background = "solid",
  className,
}: CTASectionProps) {
  const backgroundClasses = clsx({
    "bg-[color:var(--color-surface-1)]": background === "solid",
    "bg-gradient-to-r from-[color:var(--color-brand-primary)] to-[color:var(--color-brand-secondary)]":
      background === "gradient",
    "bg-[color:var(--color-surface-2)]": background === "muted",
  });

  if (variant === "split") {
    return (
      <section className={clsx("py-16", backgroundClasses, className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[color:var(--color-fg-base)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[color:var(--color-fg-muted)]">
                  {description}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx("py-16", backgroundClasses, className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--color-fg-base)]">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-lg text-[color:var(--color-fg-muted)] mb-8">
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
    </section>
  );
}

