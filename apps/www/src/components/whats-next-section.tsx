"use client";

import * as React from "react";
import { LinkCardGroup } from "@fragment_ui/blocks/link-card";
import { Settings, Palette, Package, Blocks, Sparkles } from "lucide-react";

export function WhatsNextSection() {
  return (
    <div className="mt-[var(--space-8)]">
      <h2 id="whats-next" className="text-[length:var(--typography-size-lg)] mb-[var(--space-6)]" style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}>
        What's next?
      </h2>
      
      <LinkCardGroup
        cards={[
          {
            href: "/docs/setup",
            icon: Settings,
            title: "Setup",
            description: "Install Fragment UI in your React project",
            variant: "outline",
          },
          {
            href: "/docs/foundations/tokens",
            icon: Palette,
            title: "Design Tokens",
            description: "Colors, spacing, typography, and more",
            variant: "outline",
          },
          {
            href: "/docs/foundations/theming",
            icon: Package,
            title: "Theming & Modes",
            description: "Configure themes, dark mode, and density",
            variant: "outline",
          },
          {
            href: "/docs/components",
            icon: Blocks,
            title: "Components",
            description: "Browse all available UI components",
            variant: "outline",
          },
          {
            href: "/blocks",
            icon: Blocks,
            title: "Blocks",
            description: "Ready-made screen layouts and patterns",
            variant: "outline",
          },
          {
            href: "/docs/mcp-server",
            icon: Sparkles,
            title: "AI Integration",
            description: "Connect to Copilot, Cursor, or MCP setup",
            variant: "outline",
          },
        ]}
        columns={{ sm: 1, md: 2, lg: 3 }}
      />
    </div>
  );
}

