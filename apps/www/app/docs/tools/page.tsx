"use client";

import Link from "next/link";
import { DocLayout } from "../../../src/components/doc-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@fragment_ui/ui";
import { ArrowRight } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      title: "Bundle Tracking",
      description: "Track and analyze bundle size to optimize your application performance",
      href: "/docs/tools/bundle-tracking",
    },
    {
      title: "Component Analytics",
      description: "View usage statistics and analytics for components across your application",
      href: "/tools/component-analytics",
    },
    {
      title: "Migration Assistant",
      description: "Get step-by-step guidance for migrating between Fragment UI versions",
      href: "/tools/migration-assistant",
    },
    {
      title: "Governance Dashboard",
      description: "Monitor design system adoption, compliance, and governance metrics",
      href: "/tools/governance",
    },
  ];

  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Tools</h1>
      <p className="mb-[var(--space-6)] intro-text">
        Powerful tools and utilities to help you build, maintain, and optimize your applications with Fragment UI.
      </p>

      <div className="grid gap-[var(--space-6)] mt-[var(--space-8)] md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href} className="block">
            <Card className="relative cursor-pointer hover:opacity-90 transition-opacity h-full">
              <CardHeader>
                <CardTitle className="text-[color:var(--foreground-primary)]">
                  {tool.title}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <div className="absolute bottom-4 right-4">
                <ArrowRight className="h-5 w-5 text-[color:var(--color-fg-muted)]" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-[var(--space-8)] p-[var(--space-4)] rounded-[var(--radius-md)] bg-[color:var(--color-surface-2)] border border-[color:var(--color-border-base)]">
        <h2 className="text-[length:var(--typography-size-lg)] font-semibold mb-[var(--space-2)]">About Tools</h2>
        <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
          These tools are designed to enhance your development workflow and help you get the most out of Fragment UI.
          Each tool provides specific functionality to support different aspects of building and maintaining your application.
        </p>
      </div>
    </DocLayout>
  );
}

