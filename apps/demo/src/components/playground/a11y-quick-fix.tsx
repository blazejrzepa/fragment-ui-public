"use client";

import React from "react";
import { Button } from "@fragment_ui/ui";
import { Wand2, ExternalLink } from "lucide-react";
import type { A11yResults } from "@/types/chat";

interface A11yQuickFixProps {
  violation: A11yResults["violations"][0];
  onFix?: (violationId: string, fix: A11yFix) => void;
}

export interface A11yFix {
  type: "add-aria-label" | "add-aria-labelledby" | "add-alt-text" | "add-role" | "fix-color-contrast" | "add-heading" | "fix-keyboard" | "custom";
  description: string;
  patch?: {
    op: string;
    target: { type: string; id: string };
    [key: string]: any;
  };
}

/**
 * Generate quick fix suggestions based on violation ID
 */
function generateQuickFixes(violation: A11yResults["violations"][0]): A11yFix[] {
  const fixes: A11yFix[] = [];
  const violationId = violation.id.toLowerCase();

  // Common a11y violations and their fixes
  if (violationId.includes("button-name") || violationId.includes("button-label")) {
    fixes.push({
      type: "add-aria-label",
      description: "Add aria-label to button",
      patch: {
        op: "setProp",
        target: { type: "byId", id: "" }, // Will be filled by caller
        prop: "aria-label",
        value: "Button",
      },
    });
  }

  if (violationId.includes("image-alt") || violationId.includes("image-label")) {
    fixes.push({
      type: "add-alt-text",
      description: "Add alt text to image",
      patch: {
        op: "setProp",
        target: { type: "byId", id: "" },
        prop: "alt",
        value: "Image description",
      },
    });
  }

  if (violationId.includes("color-contrast") || violationId.includes("contrast")) {
    fixes.push({
      type: "fix-color-contrast",
      description: "Improve color contrast (requires manual adjustment)",
    });
  }

  if (violationId.includes("heading-order") || violationId.includes("page-has-heading")) {
    fixes.push({
      type: "add-heading",
      description: "Add proper heading structure",
    });
  }

  if (violationId.includes("keyboard") || violationId.includes("focus")) {
    fixes.push({
      type: "fix-keyboard",
      description: "Fix keyboard navigation",
    });
  }

  if (violationId.includes("aria") && !violationId.includes("label")) {
    fixes.push({
      type: "add-role",
      description: "Add appropriate ARIA role",
    });
  }

  // Generic fix if no specific fix found
  if (fixes.length === 0) {
    fixes.push({
      type: "custom",
      description: `Fix: ${violation.help}`,
    });
  }

  return fixes;
}

/**
 * A11y Quick Fix - displays fix suggestions for a violation
 */
export const A11yQuickFix = React.memo(function A11yQuickFix({
  violation,
  onFix,
}: A11yQuickFixProps) {
  const fixes = React.useMemo(() => generateQuickFixes(violation), [violation]);

  if (fixes.length === 0) {
    return null;
  }

  const handleFix = (fix: A11yFix) => {
    if (onFix && fix.patch) {
      // Find the first node's data-ui-id from the violation
      // This is a simplified approach - in real implementation, we'd need to map target selectors to data-ui-id
      onFix(violation.id, fix);
    }
  };

  return (
    <div className="mt-2 pt-2 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
      <div className="text-xs font-medium text-[color:var(--foreground-secondary)] mb-2">
        Quick Fixes:
      </div>
      <div className="space-y-1.5">
        {fixes.map((fix, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 p-1.5 rounded"
            style={{
              backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
            }}
          >
            <span className="text-xs text-[color:var(--foreground-primary)] flex-1">
              {fix.description}
            </span>
            {fix.patch ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFix(fix)}
                className="h-6 px-2 text-xs flex items-center gap-1"
                title="Apply fix"
              >
                <Wand2 className="w-3 h-3" />
                Fix
              </Button>
            ) : (
              <a
                href={violation.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[color:var(--color-brand-primary)] hover:underline flex items-center gap-1"
                title="Learn how to fix"
              >
                Learn more
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

