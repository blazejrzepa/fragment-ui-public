"use client";

import * as React from "react";
import { Badge } from "@fragment_ui/ui";
import { CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

export interface ComparisonFeature {
  name: string;
  description?: string;
}

export interface ComparisonPlan {
  name: string;
  description?: string;
  popular?: boolean;
  features: Record<string, boolean | string>; // feature name -> included (true/false) or value
}

export interface ComparisonSectionProps {
  title?: string;
  description?: string;
  plans: ComparisonPlan[];
  features: ComparisonFeature[];
  showHeader?: boolean;
  className?: string;
}

export function ComparisonSection({
  title,
  description,
  plans = [],
  features = [],
  showHeader = true,
  className,
}: ComparisonSectionProps) {
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
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {showHeader && (
              <thead>
                <tr>
                  <th className="text-left p-4 border-b border-[color:var(--color-border-base)]">
                    <span className="text-sm font-medium text-[color:var(--color-fg-muted)]">
                      Features
                    </span>
                  </th>
                  {plans.map((plan, index) => (
                    <th
                      key={index}
                      className={clsx(
                        "text-center p-4 border-b border-[color:var(--color-border-base)]",
                        plan.popular && "bg-[color:var(--color-surface-2)]"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-[color:var(--color-fg-base)]">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <Badge variant="solid" size="sm">
                              Popular
                            </Badge>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-sm text-[color:var(--color-fg-muted)]">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr
                  key={featureIndex}
                  className={clsx(
                    "border-b border-[color:var(--color-border-base)]",
                    featureIndex % 2 === 0 && "bg-[color:var(--color-surface-1)]"
                  )}
                >
                  <td className="p-4">
                    <div>
                      <span className="font-medium text-[color:var(--color-fg-base)]">
                        {feature.name}
                      </span>
                      {feature.description && (
                        <p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </td>
                  {plans.map((plan, planIndex) => {
                    const featureValue = plan.features[feature.name];
                    const isIncluded = featureValue === true || typeof featureValue === "string";
                    
                    return (
                      <td
                        key={planIndex}
                        className={clsx(
                          "text-center p-4",
                          plan.popular && "bg-[color:var(--color-surface-2)]"
                        )}
                      >
                        {typeof featureValue === "string" ? (
                          <span className="text-sm text-[color:var(--color-fg-base)] font-medium">
                            {featureValue}
                          </span>
                        ) : isIncluded ? (
                          <CheckCircle2 className="w-5 h-5 text-[color:var(--color-brand-primary)] mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[color:var(--color-fg-muted)] mx-auto opacity-50" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

