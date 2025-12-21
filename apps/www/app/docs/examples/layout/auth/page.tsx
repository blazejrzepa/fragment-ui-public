"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { AuthenticationBlock } from "@fragment_ui/blocks";

export default function AuthenticationFlowExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Auth</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Auth example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] max-w-md">
        <AuthenticationBlock />
      </div>
    </DocLayout>
  );
}

