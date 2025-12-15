"use client";

import * as React from "react";
import clsx from "clsx";

export type ConditionalRule = {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan" | "includes";
  value: any;
};

export interface ConditionalFieldProps {
  show: boolean | ConditionalRule[];
  children: React.ReactNode;
  className?: string;
  animation?: "fade" | "slide" | "none";
}

/**
 * Renders children conditionally based on rules or boolean
 */
export function ConditionalField({
  show,
  children,
  className,
  animation = "fade",
}: ConditionalFieldProps) {
  const shouldShow = React.useMemo(() => {
    if (typeof show === "boolean") return show;
    // For now, we'll handle rules in parent component
    // This is a simple wrapper for conditional rendering
    return true;
  }, [show]);

  if (!shouldShow) return null;

  return (
    <div
      className={clsx(
        animation === "fade" && "animate-in fade-in duration-200",
        animation === "slide" && "animate-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Hook to evaluate conditional rules against form values
 */
export function useConditionalShow(
  rules: ConditionalRule[] | boolean,
  formValues: Record<string, any>
): boolean {
  return React.useMemo(() => {
    if (typeof rules === "boolean") return rules;

    return rules.every((rule) => {
      const fieldValue = formValues[rule.field];

      switch (rule.operator) {
        case "equals":
          return fieldValue === rule.value;
        case "notEquals":
          return fieldValue !== rule.value;
        case "contains":
          return String(fieldValue || "").includes(String(rule.value));
        case "includes":
          return Array.isArray(fieldValue) && fieldValue.includes(rule.value);
        case "greaterThan":
          return Number(fieldValue) > Number(rule.value);
        case "lessThan":
          return Number(fieldValue) < Number(rule.value);
        default:
          return false;
      }
    });
  }, [rules, formValues]);
}

