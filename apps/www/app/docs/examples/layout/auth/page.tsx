"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { AuthenticationBlock } from "@fragment_ui/blocks";

export default function AuthenticationFlowExample() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Auth</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Auth example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6 max-w-md">
        <AuthenticationBlock />
      </div>
    </DocLayout>
  );
}

