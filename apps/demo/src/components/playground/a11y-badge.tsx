"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@fragment_ui/ui";
import type { A11yResults } from "@/types/preview";

interface A11yBadgeProps {
  a11yResults: A11yResults | null;
  onClick?: () => void;
}

/**
 * A11y Badge - displays accessibility violations count
 * 
 * Shows a badge with the number of violations.
 * Green badge with checkmark if no violations.
 * Red badge with alert icon if violations exist.
 * Clicking opens the accessibility panel.
 */
export const A11yBadge = React.memo(function A11yBadge({
  a11yResults,
  onClick,
}: A11yBadgeProps) {
  if (!a11yResults) {
    return null;
  }

  const violationsCount = a11yResults.violations.length;
  const criticalCount = a11yResults.violations.filter(
    v => v.impact === "critical" || v.impact === "serious"
  ).length;

  // Don't show badge if no violations and no passes (check not completed)
  if (violationsCount === 0 && a11yResults.passes === 0) {
    return null;
  }

  const hasViolations = violationsCount > 0;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all hover:opacity-80 cursor-pointer border"
      style={{
        backgroundColor: hasViolations 
          ? "color-mix(in srgb, var(--color-status-error-base) 10%, transparent)"
          : "color-mix(in srgb, var(--color-status-success-base) 10%, transparent)",
        borderColor: hasViolations
          ? "color-mix(in srgb, var(--color-status-error-base) 30%, transparent)"
          : "color-mix(in srgb, var(--color-status-success-base) 30%, transparent)",
        borderWidth: "1px",
      }}
      title={hasViolations 
        ? `${violationsCount} accessibility violation${violationsCount !== 1 ? 's' : ''} found. Click to view details.`
        : `No accessibility violations. ${a11yResults.passes} checks passed.`
      }
    >
      {hasViolations ? (
        <>
          <AlertTriangle 
            className="w-3.5 h-3.5" 
            style={{ 
              color: "var(--color-status-error-base)",
            }} 
          />
          <span 
            className="text-xs font-semibold"
            style={{ 
              color: "var(--color-status-error-base)",
            }}
          >
            {violationsCount}
            {criticalCount > 0 && (
              <span className="ml-0.5" title={`${criticalCount} critical/serious violation${criticalCount !== 1 ? 's' : ''}`}>
                ⚠️
              </span>
            )}
          </span>
        </>
      ) : (
        <>
          <CheckCircle2 
            className="w-3.5 h-3.5" 
            style={{ 
              color: "var(--color-status-success-base)",
            }} 
          />
          <span 
            className="text-xs font-semibold"
            style={{ 
              color: "var(--color-status-success-base)",
            }}
          >
            ✓
          </span>
        </>
      )}
    </button>
  );
});

