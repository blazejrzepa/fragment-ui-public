/**
 * Decision Pattern: Compare 3 Options
 * 
 * Displays 3 options as cards with a comparison matrix showing differences.
 * Used for pricing pages, feature comparisons, plan selections, etc.
 * 
 * ACL Attributes:
 * - data-section-role="decision-compare-3"
 * - data-option-id for each option
 * - data-compare-key for comparison features
 */

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import clsx from "clsx";

export interface CompareOption {
  id: string;
  name: string;
  description?: string;
  price?: string;
  pricePeriod?: string;
  features: Array<{
    key: string; // Unique key for comparison (e.g., "storage", "support")
    label: string;
    value: string | boolean; // Value or included/not included
  }>;
  ctaText: string;
  ctaOnClick?: () => void;
  ctaHref?: string;
  popular?: boolean;
  disabled?: boolean;
  actionContractId?: string; // For ACL - links to ActionContract
}

export interface Compare3Props {
  title?: string;
  description?: string;
  options: CompareOption[];
  className?: string;
}

export function Compare3({ title, description, options, className }: Compare3Props) {
  // Extract all comparison keys from all options
  const allKeys = React.useMemo(() => {
    const keys = new Set<string>();
    options.forEach(option => {
      option.features.forEach(feature => {
        keys.add(feature.key);
      });
    });
    return Array.from(keys);
  }, [options]);

  return (
    <div 
      className={clsx("space-y-8", className)}
      data-section-role="decision-compare-3"
    >
      {title && (
        <div className="text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && (
            <p className="mt-2 text-[color:var(--color-fg-muted)]">{description}</p>
          )}
        </div>
      )}

      {/* Options as Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {options.map((option, index) => (
          <Card
            key={option.id}
            data-option-id={option.id}
            className={clsx(
              "flex flex-col",
              option.popular && "border-[color:var(--color-brand-primary)] shadow-lg",
              option.disabled && "opacity-60"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{option.name}</CardTitle>
                {option.popular && (
                  <Badge variant="solid" size="sm">
                    Popular
                  </Badge>
                )}
              </div>
              {option.description && (
                <CardDescription>{option.description}</CardDescription>
              )}
              {option.price && (
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{option.price}</span>
                    {option.pricePeriod && (
                      <span className="text-sm text-[color:var(--color-fg-muted)]">
                        /{option.pricePeriod}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {option.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex}
                    data-compare-key={feature.key}
                    className="flex items-start gap-2"
                  >
                    <span
                      className={clsx(
                        "mt-0.5 flex-shrink-0",
                        feature.value === true || (typeof feature.value === "string" && feature.value !== "")
                          ? "text-[color:var(--color-brand-primary)]"
                          : "text-[color:var(--color-fg-muted)]"
                      )}
                    >
                      {feature.value === true || (typeof feature.value === "string" && feature.value !== "") ? "✓" : "✗"}
                    </span>
                    <span className="text-sm">
                      {feature.label}: {typeof feature.value === "boolean" ? "" : feature.value}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {option.ctaHref ? (
                <Button asChild
                    variant={option.popular ? "solid" : "outline"}
                    className="w-full"
                    disabled={option.disabled}
                    data-action-id={option.actionContractId}
                    data-action-kind={option.actionContractId ? "soft" : undefined}
                  ><a href={option.ctaHref} className="w-full">
                    {option.ctaText}
                  </a></Button>
              ) : (
                <Button
                  variant={option.popular ? "solid" : "outline"}
                  className="w-full"
                  disabled={option.disabled}
                  onClick={option.ctaOnClick}
                  data-action-id={option.actionContractId}
                  data-action-kind={option.actionContractId ? "soft" : undefined}
                >
                  {option.ctaText}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison Matrix */}
      {allKeys.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[color:var(--color-border-primary)] p-3 text-left font-semibold">
                  Feature
                </th>
                {options.map(option => (
                  <th
                    key={option.id}
                    className="border border-[color:var(--color-border-primary)] p-3 text-center font-semibold"
                    data-option-id={option.id}
                  >
                    {option.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allKeys.map(key => {
                const featureLabel = options
                  .flatMap(o => o.features)
                  .find(f => f.key === key)?.label || key;
                
                return (
                  <tr key={key}>
                    <td
                      className="border border-[color:var(--color-border-primary)] p-3 font-medium"
                      data-compare-key={key}
                    >
                      {featureLabel}
                    </td>
                    {options.map(option => {
                      const feature = option.features.find(f => f.key === key);
                      const value = feature?.value;
                      const hasValue = value === true || (typeof value === "string" && value !== "");
                      
                      return (
                        <td
                          key={option.id}
                          className="border border-[color:var(--color-border-primary)] p-3 text-center"
                          data-option-id={option.id}
                          data-compare-key={key}
                        >
                          {hasValue ? (
                            <span className="text-[color:var(--color-brand-primary)]">✓</span>
                          ) : (
                            <span className="text-[color:var(--color-fg-muted)]">✗</span>
                          )}
                          {typeof value === "string" && value !== "" && (
                            <span className="ml-2 text-sm">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

