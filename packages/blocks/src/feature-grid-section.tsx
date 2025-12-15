"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";
import clsx from "clsx";

export interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureGridSectionProps {
  title?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGridSection({
  title,
  description,
  features = [],
  columns = 3,
  className,
}: FeatureGridSectionProps) {
  // Ensure features is always an array
  const safeFeatures = Array.isArray(features) ? features : [];
  
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

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
          {safeFeatures.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                {feature.icon && (
                  <div className="mb-4 text-[color:var(--color-brand-primary)] text-3xl">
                    {feature.icon}
                  </div>
                )}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--color-fg-muted)]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

