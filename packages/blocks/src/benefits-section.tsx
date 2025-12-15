"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export interface Benefit {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface BenefitsSectionProps {
  title?: string;
  description?: string;
  benefits: Benefit[];
  layout?: "grid" | "list";
  columns?: 2 | 3 | 4;
  className?: string;
}

export function BenefitsSection({
  title,
  description,
  benefits = [],
  layout = "grid",
  columns = 3,
  className,
}: BenefitsSectionProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const defaultIcon = <CheckCircle2 className="h-6 w-6" />;

  if (layout === "list") {
    return (
      <section className={clsx("py-16", className)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || description) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-fg-base)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-[color:var(--color-fg-muted)] max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-4 rounded-lg border border-[color:var(--color-border-base)]"
              >
                <div className="flex-shrink-0 text-[color:var(--color-brand-primary)] mt-1">
                  {benefit.icon || defaultIcon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-fg-base)]">
                    {benefit.title}
                  </h3>
                  <p className="text-[color:var(--color-fg-muted)]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx("py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-fg-base)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-[color:var(--color-fg-muted)] max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={clsx("grid gap-6", gridCols[columns])}>
          {benefits.map((benefit, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-[color:var(--color-brand-primary)]">
                    {benefit.icon || defaultIcon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--color-fg-muted)]">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
