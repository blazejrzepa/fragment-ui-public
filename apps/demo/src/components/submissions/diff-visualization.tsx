/**
 * Diff Visualization Component
 * 
 * Phase 3: D3 - Review Interface
 * 
 * Shows side-by-side diff of code/DSL changes between revisions
 */

"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";

export interface DiffVisualizationProps {
  oldCode: string;
  newCode: string;
  oldLabel?: string;
  newLabel?: string;
  language?: "tsx" | "json" | "text";
}

/**
 * Simple line-by-line diff visualization
 * Shows added, removed, and unchanged lines
 */
export function DiffVisualization({
  oldCode,
  newCode,
  oldLabel = "Before",
  newLabel = "After",
  language = "text",
}: DiffVisualizationProps) {
  const diffLines = useMemo(() => {
    const oldLines = oldCode.split("\n");
    const newLines = newCode.split("\n");
    const maxLines = Math.max(oldLines.length, newLines.length);
    const diff: Array<{
      oldLine: string | null;
      newLine: string | null;
      type: "added" | "removed" | "unchanged";
    }> = [];

    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const oldLine = oldIndex < oldLines.length ? oldLines[oldIndex] : null;
      const newLine = newIndex < newLines.length ? newLines[newIndex] : null;

      if (oldLine === newLine) {
        // Unchanged line
        diff.push({
          oldLine: oldLine || "",
          newLine: newLine || "",
          type: "unchanged",
        });
        oldIndex++;
        newIndex++;
      } else if (oldLine === null) {
        // Added line
        diff.push({
          oldLine: null,
          newLine: newLine || "",
          type: "added",
        });
        newIndex++;
      } else if (newLine === null) {
        // Removed line
        diff.push({
          oldLine: oldLine || "",
          newLine: null,
          type: "removed",
        });
        oldIndex++;
      } else {
        // Different lines - show both
        diff.push({
          oldLine: oldLine || "",
          newLine: newLine || "",
          type: "removed",
        });
        diff.push({
          oldLine: null,
          newLine: newLine || "",
          type: "added",
        });
        oldIndex++;
        newIndex++;
      }
    }

    return diff;
  }, [oldCode, newCode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Diff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Old Code */}
          <div>
            <div className="text-xs font-semibold text-[color:var(--color-fg-muted)] mb-2">
              {oldLabel}
            </div>
            <div className="border rounded-lg overflow-auto max-h-[600px]">
              <pre className="p-4 text-xs font-mono">
                <code>
                  {diffLines.map((line, index) => (
                    <div
                      key={`old-${index}`}
                      className={
                        line.type === "removed"
                          ? "bg-red-500/20 text-red-600"
                          : line.type === "unchanged"
                          ? "text-[color:var(--color-fg-base)]"
                          : "opacity-50"
                      }
                    >
                      {line.oldLine !== null ? (
                        <>
                          <span className="text-[color:var(--color-fg-muted)] mr-2">
                            {index + 1}
                          </span>
                          {line.oldLine || "\n"}
                        </>
                      ) : (
                        <span className="text-[color:var(--color-fg-muted)]">
                          {" "}
                        </span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* New Code */}
          <div>
            <div className="text-xs font-semibold text-[color:var(--color-fg-muted)] mb-2">
              {newLabel}
            </div>
            <div className="border rounded-lg overflow-auto max-h-[600px]">
              <pre className="p-4 text-xs font-mono">
                <code>
                  {diffLines.map((line, index) => (
                    <div
                      key={`new-${index}`}
                      className={
                        line.type === "added"
                          ? "bg-green-500/20 text-green-600"
                          : line.type === "unchanged"
                          ? "text-[color:var(--color-fg-base)]"
                          : "opacity-50"
                      }
                    >
                      {line.newLine !== null ? (
                        <>
                          <span className="text-[color:var(--color-fg-muted)] mr-2">
                            {index + 1}
                          </span>
                          {line.newLine || "\n"}
                        </>
                      ) : (
                        <span className="text-[color:var(--color-fg-muted)]">
                          {" "}
                        </span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

