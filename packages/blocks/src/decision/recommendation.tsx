/**
 * Decision Pattern: Recommendation
 * 
 * Displays a ranked list of options with justification/reasoning.
 * Used for "recommended for you", "best choice", etc.
 * 
 * ACL Attributes:
 * - data-section-role="decision-recommendation"
 * - data-option-id for each option
 * - data-rank for ranking position
 */

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import clsx from "clsx";

export interface RecommendationOption {
  id: string;
  name: string;
  description?: string;
  rank: number; // 1 = best, 2 = second best, etc.
  reasoning?: string; // Why this option is recommended
  score?: number; // Optional score (0-100)
  ctaText: string;
  ctaOnClick?: () => void;
  ctaHref?: string;
  actionContractId?: string; // For ACL - links to ActionContract
}

export interface RecommendationProps {
  title?: string;
  description?: string;
  options: RecommendationOption[];
  className?: string;
}

export function Recommendation({ title, description, options, className }: RecommendationProps) {
  // Sort by rank (1 = best)
  const sortedOptions = React.useMemo(() => {
    return [...options].sort((a, b) => a.rank - b.rank);
  }, [options]);

  return (
    <div 
      className={clsx("space-y-6", className)}
      data-section-role="decision-recommendation"
    >
      {title && (
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && (
            <p className="mt-2 text-[color:var(--color-fg-muted)]">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {sortedOptions.map((option) => (
          <Card
            key={option.id}
            data-option-id={option.id}
            data-rank={option.rank}
            className={clsx(
              option.rank === 1 && "border-[color:var(--color-brand-primary)] shadow-lg"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "flex h-10 w-10 items-center justify-center rounded-full font-bold",
                      option.rank === 1
                        ? "bg-[color:var(--color-brand-primary)] text-white"
                        : "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-primary)]"
                    )}
                  >
                    {option.rank}
                  </div>
                  <div>
                    <CardTitle>{option.name}</CardTitle>
                    {option.description && (
                      <CardDescription>{option.description}</CardDescription>
                    )}
                  </div>
                </div>
                {option.rank === 1 && (
                  <Badge variant="solid" size="sm">
                    Recommended
                  </Badge>
                )}
                {option.score !== undefined && (
                  <Badge variant="outline" size="sm">
                    {option.score}% match
                  </Badge>
                )}
              </div>
            </CardHeader>
            {option.reasoning && (
              <CardContent>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  <strong>Why this option:</strong> {option.reasoning}
                </p>
              </CardContent>
            )}
            <CardFooter>
              {option.ctaHref ? (
                <Link href={option.ctaHref}>
                  <Button
                    variant={option.rank === 1 ? "solid" : "outline"}
                    data-action-id={option.actionContractId}
                    data-action-kind={option.actionContractId ? "soft" : undefined}
                  >
                    {option.ctaText}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={option.rank === 1 ? "solid" : "outline"}
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

