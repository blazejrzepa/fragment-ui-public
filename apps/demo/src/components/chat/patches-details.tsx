"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "@fragment_ui/ui";
import { X } from "lucide-react";

interface PatchDetail {
  op: string;
  targetId: string;
  args?: Record<string, any>;
}

interface PatchesDetailsProps {
  patches: PatchDetail[];
  onClose: () => void;
}

/**
 * Modal/Dialog showing details of applied patches
 */
export function PatchesDetails({ patches, onClose }: PatchesDetailsProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Applied Patches</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg-base)]"
          data-action-id="close-patches-details"
          data-action-kind="navigation"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {patches.map((patch, index) => (
            <div
              key={index}
              className="p-3 rounded border bg-[color:var(--color-surface-1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-[color:var(--color-brand-primary)]">
                      {patch.op}
                    </span>
                    <span className="text-xs text-[color:var(--color-fg-muted)]">
                      on
                    </span>
                    <span className="font-mono text-xs">
                      {patch.targetId.substring(0, 8)}...
                    </span>
                  </div>
                  {patch.args && Object.keys(patch.args).length > 0 && (
                    <div className="mt-2 text-xs text-[color:var(--color-fg-muted)]">
                      <pre className="whitespace-pre-wrap font-mono">
                        {JSON.stringify(patch.args, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

