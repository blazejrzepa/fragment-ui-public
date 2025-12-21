"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { SettingsScreen } from "@fragment_ui/blocks";

export default function SettingsPageExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Settings</h1>
      <p className="mb-[var(--space-6)] intro-text text-[color:var(--foreground-secondary)] font-normal">
        Settings example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] border rounded-[var(--radius-md)] overflow-hidden">
        <SettingsScreen />
      </div>
    </DocLayout>
  );
}

