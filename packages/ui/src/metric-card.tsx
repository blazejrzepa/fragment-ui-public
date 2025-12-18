"use client";

import * as React from "react";
import { Card, CardContent } from "./card";
import clsx from "clsx";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  footer?: React.ReactNode;
  /**
   * Where to render the footer content.
   * @default "header"
   */
  footerPlacement?: "header" | "content";
  className?: string;
  onClick?: () => void;
}

const TREND_CONFIG = {
  up: { icon: "↑", color: "text-[color:var(--color-fg-base)]" },
  down: { icon: "↓", color: "text-[color:var(--color-status-error-base)]" },
  neutral: { icon: "→", color: "text-[color:var(--color-fg-muted)]" },
} as const;

const getTrendIcon = (trend?: "up" | "down" | "neutral"): string => {
  return trend ? TREND_CONFIG[trend].icon : TREND_CONFIG.neutral.icon;
};

const getTrendColor = (trend?: "up" | "down" | "neutral"): string => {
  return trend ? TREND_CONFIG[trend].color : TREND_CONFIG.neutral.color;
};

interface TrendBadgeProps {
  trend: "up" | "down" | "neutral";
  value: string;
}

const TrendBadge = React.memo(({ trend, value }: TrendBadgeProps) => (
  <div
    className={clsx(
      "inline-flex items-center justify-center gap-[var(--space-1)] rounded-full",
      "px-[var(--space-2-5)] py-[var(--space-1)] text-xs font-normal",
      "border border-[color:var(--color-border-base)]",
      "transition-colors",
      getTrendColor(trend)
    )}
  >
    <span>{getTrendIcon(trend)}</span>
    <span>{value}</span>
  </div>
));

TrendBadge.displayName = "TrendBadge";

export const MetricCard = React.memo(
  React.forwardRef<HTMLDivElement, MetricCardProps>(
    function MetricCard(
      {
        title,
        value,
        icon,
        trend,
        trendValue,
        description,
        footer,
        footerPlacement = "header",
        className,
        onClick,
      },
      ref
    ) {
      const trendFooter = React.useMemo(() => {
        if (trend && trendValue && !footer) {
          return <TrendBadge trend={trend} value={trendValue} />;
        }
        return null;
      }, [trend, trendValue, footer]);

      const finalFooter = footer || trendFooter;
      const showHeaderFooter = finalFooter && footerPlacement === "header";
      const showContentFooter = finalFooter && footerPlacement === "content";

      return (
        <Card
          ref={ref}
          className={clsx(
            onClick && "cursor-pointer hover:shadow-lg transition-shadow",
            className
          )}
          onClick={onClick}
        >
          {/* Header Section */}
          <div className="flex items-start justify-between gap-[var(--space-3)] pb-[var(--space-2)] w-full">
            <div className="flex items-center justify-start gap-[var(--space-2)] min-w-0 flex-1">
              {icon && (
                <div className="text-[color:var(--color-fg-muted)] flex-shrink-0">
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-normal text-[color:var(--color-fg-muted)] m-0">
                {title}
              </h3>
            </div>
            {showHeaderFooter && (
              <div className="flex-shrink-0">{finalFooter}</div>
            )}
          </div>

          {/* Content Section */}
          <CardContent className="mt-[var(--space-2)] mb-[var(--space-1)]">
            <div className="text-2xl font-medium text-[color:var(--color-fg-base)]">
              {value}
            </div>
            {description && (
              <p className="text-xs font-medium text-[color:var(--color-fg-muted)] mt-[var(--space-1)]">
                {description}
              </p>
            )}
            {showContentFooter && (
              <div className="mt-[var(--space-4)]">{finalFooter}</div>
            )}
          </CardContent>
        </Card>
      );
    }
  )
);

MetricCard.displayName = "MetricCard";
