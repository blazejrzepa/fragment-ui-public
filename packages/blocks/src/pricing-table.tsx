import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import clsx from "clsx";

export interface PricingFeature {
  name: string;
  included?: boolean;
  description?: string;
}

export interface PricingTier {
  name: string;
  description?: string;
  price: string;
  pricePeriod?: string;
  priceDescription?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaOnClick?: () => void;
  ctaHref?: string;
  popular?: boolean;
  disabled?: boolean;
}

export interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
}

export function PricingTable({ tiers, className }: PricingTableProps) {
  return (
    <div className={clsx("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {tiers.map((tier, index) => (
        <Card
          key={index}
          className={clsx(
            "flex flex-col",
            tier.popular && "border-[color:var(--color-brand-primary)] shadow-lg",
            tier.disabled && "opacity-60"
          )}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{tier.name}</CardTitle>
              {tier.popular && (
                <Badge variant="solid" size="sm">
                  Popular
                </Badge>
              )}
            </div>
            {tier.description && (
              <CardDescription>{tier.description}</CardDescription>
            )}
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.pricePeriod && (
                  <span className="text-sm text-[color:var(--color-fg-muted)]">
                    /{tier.pricePeriod}
                  </span>
                )}
              </div>
              {tier.priceDescription && (
                <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
                  {tier.priceDescription}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <span
                    className={clsx(
                      "mt-0.5 flex-shrink-0",
                      feature.included !== false
                        ? "text-[color:var(--color-brand-primary)]"
                        : "text-[color:var(--color-fg-muted)]"
                    )}
                  >
                    {feature.included !== false ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <span
                      className={clsx(
                        feature.included !== false
                          ? "text-[color:var(--color-fg-base)]"
                          : "text-[color:var(--color-fg-muted)] line-through"
                      )}
                    >
                      {feature.name}
                    </span>
                    {feature.description && (
                      <p className="mt-0.5 text-xs text-[color:var(--color-fg-muted)]">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {tier.ctaHref ? (
              <a href={tier.ctaHref} className="w-full">
                <Button
                  variant="solid"
                  size="lg"
                  className="w-full"
                  disabled={tier.disabled}
                >
                  {tier.ctaText}
                </Button>
              </a>
            ) : (
              <Button
                variant={tier.popular ? "solid" : "outline"}
                size="lg"
                className="w-full"
                onClick={tier.ctaOnClick}
                disabled={tier.disabled}
              >
                {tier.ctaText}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

