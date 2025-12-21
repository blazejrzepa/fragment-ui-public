"use client";

import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import { LucideIcon, ExternalLink } from "lucide-react";

export interface LinkCardProps {
  /**
   * URL to navigate to
   */
  href: string;
  /**
   * Icon component from lucide-react
   */
  icon: LucideIcon;
  /**
   * Card title
   */
  title: string;
  /**
   * Card description
   */
  description: string;
  /**
   * Visual variant of the card
   * @default "solid"
   */
  variant?: "solid" | "outline";
  /**
   * Whether the link opens in a new tab
   * @default false
   */
  external?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LinkCard component - A card that acts as a link
 * 
 * @example
 * ```tsx
 * <LinkCard
 *   href="/docs/setup"
 *   icon={Settings}
 *   title="Setup"
 *   description="Install Fragment UI in your React project"
 * />
 * ```
 */
export function LinkCard({
  href,
  icon: Icon,
  title,
  description,
  variant = "solid",
  external = false,
  className,
}: LinkCardProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const variantClasses = {
    solid: clsx(
      "bg-[color:var(--color-surface-1)] border-[0.5px] border-[color:var(--color-border-base)]",
      "hover:bg-[color:var(--color-surface-2)]"
    ),
    outline: clsx(
      "bg-transparent border-[0.5px] border-[color:var(--color-border-base)]",
      "hover:bg-[color:var(--color-surface-1)]"
    ),
  };

  return (
    <Link
      href={href}
      className={clsx(
        "group relative block w-full rounded-[var(--radius-md)]",
        variantClasses[variant],
        "overflow-hidden cursor-pointer",
        "transition-all duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-base)] focus-visible:ring-offset-2",
        "no-underline",
        className
      )}
      style={{ textDecoration: "none" }}
      {...linkProps}
    >
      <div className="px-[var(--space-6)] pt-[var(--space-6)] pb-[var(--space-6)] relative h-full">
        {/* External link icon - shows in top right corner */}
        {external && (
          <div className="absolute top-[var(--space-6)] right-[var(--space-6)]">
            <ExternalLink className="h-[var(--space-4)] w-[var(--space-4)] text-[color:var(--color-fg-muted)]" strokeWidth={1.5} />
          </div>
        )}

        {/* Icon */}
        <div className="h-[var(--space-6)] w-[var(--space-6)] mb-[var(--space-6)]">
          <Icon className="h-[var(--space-6)] w-[var(--space-6)] shrink-0 text-[color:var(--color-fg-base)]" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 h-fit justify-start items-start">
          <h3 className="text-[length:var(--typography-size-base)] text-[color:var(--color-fg-base)] mt-0 mb-0" style={{ textDecoration: "none", fontWeight: "var(--typography-weight-semibold, 600)", marginBottom: "0px", marginTop: "0px" }}>
            {title}
          </h3>
          <p className="text-[length:var(--typography-size-base)] text-[color:var(--color-fg-muted)] mt-0 mb-0" style={{ textDecoration: "none", fontWeight: "var(--typography-weight-regular, 400)", lineHeight: "var(--typography-line-height-text, 1.5)", marginBottom: "0px" }}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export interface LinkCardGroupProps {
  /**
   * Array of LinkCard items
   */
  cards: Omit<LinkCardProps, "className">[];
  /**
   * Number of columns on different breakpoints
   * @default { sm: 1, md: 2, lg: 3 }
   */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LinkCardGroup component - A grid of LinkCard components
 * 
 * @example
 * ```tsx
 * <LinkCardGroup
 *   cards={[
 *     { href: "/docs/setup", icon: Settings, title: "Setup", description: "Install Fragment UI" },
 *     { href: "/docs/tokens", icon: Palette, title: "Design Tokens", description: "Learn about tokens" },
 *   ]}
 * />
 * ```
 */
export function LinkCardGroup({
  cards,
  columns = { sm: 1, md: 2, lg: 3 },
  className,
}: LinkCardGroupProps) {
  // Default to responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
  const smCols = columns.sm ?? 1;
  const mdCols = columns.md ?? (columns.sm ?? 2);
  const lgCols = columns.lg ?? mdCols;

  // Map column numbers to Tailwind grid classes
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const smClass = gridColsMap[smCols] || "grid-cols-1";
  const mdClass = gridColsMap[mdCols] || smClass;
  const lgClass = gridColsMap[lgCols] || mdClass;

  // Build responsive classes: always include sm, add md/lg if different
  const gridClasses = [
    smClass,
    mdCols !== smCols && `md:${mdClass}`,
    lgCols !== mdCols && `lg:${lgClass}`,
  ].filter(Boolean);

  return (
    <div
      className={clsx(
        "grid gap-[var(--space-4)]",
        ...gridClasses,
        className
      )}
    >
      {cards.map((card, index) => (
        <LinkCard key={index} {...card} />
      ))}
    </div>
  );
}

