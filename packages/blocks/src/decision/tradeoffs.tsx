/**
 * Decision Pattern: Tradeoffs
 * 
 * Displays options in a "cost vs risk vs time" visualization.
 * Used for decision-making where multiple dimensions matter.
 * 
 * ACL Attributes:
 * - data-section-role="decision-tradeoffs"
 * - data-option-id for each option
 * - data-dimension for each dimension (cost, risk, time)
 */

import * as React from "react";
import { Link } from "../link-helper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export interface TradeoffDimension {
  name: string; // e.g., "Cost", "Risk", "Time"
  value: number; // 0-100 scale
  label?: string; // e.g., "Low", "Medium", "High"
}

export interface TradeoffOption {
  id: string;
  name: string;
  description?: string;
  dimensions: TradeoffDimension[];
  ctaText: string;
  ctaOnClick?: () => void;
  ctaHref?: string;
  actionContractId?: string; // For ACL - links to ActionContract
}

export interface TradeoffsProps {
  title?: string;
  description?: string;
  options: TradeoffOption[];
  className?: string;
}

export function Tradeoffs({ title, description, options, className }: TradeoffsProps) {
  return (
    <div 
      className={clsx("space-y-8", className)}
      data-section-role="decision-tradeoffs"
    >
      {title && (
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && (
            <p className="mt-2 text-[color:var(--color-fg-muted)]">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {options.map((option) => (
          <Card key={option.id} data-option-id={option.id}>
            <CardHeader>
              <CardTitle>{option.name}</CardTitle>
              {option.description && (
                <CardDescription>{option.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {option.dimensions.map((dimension, index) => (
                  <div key={index} data-dimension={dimension.name.toLowerCase()}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{dimension.name}</span>
                      <span className="text-sm text-[color:var(--color-fg-muted)]">
                        {dimension.label || `${dimension.value}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                      <div
                        className="h-full bg-[color:var(--color-brand-primary)] transition-all"
                        style={{ width: `${dimension.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {option.ctaHref ? (
                <Link href={option.ctaHref}>
                  <Button
                    variant="outline"
                    data-action-id={option.actionContractId}
                    data-action-kind={option.actionContractId ? "soft" : undefined}
                  >
                    {option.ctaText}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
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
    </div>
  );
}

