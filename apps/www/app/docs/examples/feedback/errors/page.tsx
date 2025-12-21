"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Card, CardContent } from "@fragment_ui/ui";

export default function ErrorHandlingExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Errors</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Errors example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-4 my-[var(--space-6)]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Error Alert</h3>
          <Card className="border-[color:var(--color-accent-red)]/20 bg-[color:var(--color-accent-red)]/10">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-[color:var(--color-accent-red)]">Error</h4>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Something went wrong. Please try again later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Warning Alert</h3>
          <Card className="border-[color:var(--color-accent-yellow)]/20 bg-[color:var(--color-accent-yellow)]/10">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-[color:var(--color-accent-yellow)]">Warning</h4>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  This action may have unintended consequences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Info Alert</h3>
          <Card className="border-[color:var(--color-accent-blue)]/20 bg-[color:var(--color-accent-blue)]/10">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-[color:var(--color-accent-blue)]">Information</h4>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  This is an informational message.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocLayout>
  );
}

