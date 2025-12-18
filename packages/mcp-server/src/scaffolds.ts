/**
 * MCP Server: Scaffolds Tools
 * 
 * Provides access to Fragment UI scaffolds (layout components)
 */

import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getRepoRoot } from "./root.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = getRepoRoot();

export interface ScaffoldInfo {
  name: string;
  description: string;
  props?: Record<string, any>;
  example?: string;
}

/**
 * List all available scaffolds
 */
export function listScaffolds(): ScaffoldInfo[] {
  return [
    {
      name: "form-auth",
      description: "Centered card layout for authentication forms (login, signup, password reset)",
      props: {
        title: "string (optional)",
        description: "string (optional)",
        maxWidth: "sm | md | lg | xl (optional, default: md)",
      },
      example: `import { FormAuthLayout } from "@fragment_ui/scaffolds";

<FormAuthLayout title="Sign in" description="Enter your credentials">
  {/* Your form content here */}
</FormAuthLayout>`,
    },
    {
      name: "two-column",
      description: "Responsive two-column layout with configurable widths and gaps",
      props: {
        left: "ReactNode (required)",
        right: "ReactNode (required)",
        leftWidth: "1/3 | 1/2 | 2/3 (optional, default: 1/2)",
        gap: "0-8 (optional, default: 4)",
        reverse: "boolean (optional, default: false)",
      },
      example: `import { TwoColumnLayout } from "@fragment_ui/scaffolds";

<TwoColumnLayout left={<Sidebar />} right={<MainContent />} />`,
    },
    {
      name: "settings-page",
      description: "Tabbed layout for settings pages with multiple sections",
      props: {
        title: "string (optional, default: 'Settings')",
        tabs: "SettingsTab[] (required)",
        defaultTab: "string (optional)",
        maxWidth: "sm | md | lg | xl | 2xl | full (optional, default: 2xl)",
      },
      example: `import { SettingsPageLayout } from "@fragment_ui/scaffolds";

<SettingsPageLayout
  title="Account Settings"
  tabs={[
    { id: "profile", label: "Profile", content: <ProfileForm /> },
    { id: "security", label: "Security", content: <SecurityForm /> },
  ]}
/>`,
    },
  ];
}

/**
 * Get scaffold information by name
 */
export function getScaffoldInfo(name: string): ScaffoldInfo | null {
  const scaffolds = listScaffolds();
  return scaffolds.find((s) => s.name === name) || null;
}

/**
 * Generate code using a scaffold
 * 
 * @param scaffoldName - Name of the scaffold (form-auth, two-column, settings-page)
 * @param uiDsl - UI-DSL object with scaffold configuration
 */
export async function createScaffold(
  scaffoldName: string,
  uiDsl: Record<string, any>
): Promise<string> {
  const scaffold = getScaffoldInfo(scaffoldName);
  if (!scaffold) {
    throw new Error(`Unknown scaffold: ${scaffoldName}`);
  }

  switch (scaffoldName) {
    case "form-auth": {
      const { title, description, maxWidth = "md" } = uiDsl;
      return `import { FormAuthLayout } from "@fragment_ui/scaffolds";

<FormAuthLayout${title ? ` title="${title}"` : ""}${description ? ` description="${description}"` : ""}${maxWidth !== "md" ? ` maxWidth="${maxWidth}"` : ""}>
  {/* Your form content here */}
</FormAuthLayout>`;
    }

    case "two-column": {
      const { left, right, leftWidth = "1/2", gap = 4, reverse = false } = uiDsl;
      return `import { TwoColumnLayout } from "@fragment_ui/scaffolds";

<TwoColumnLayout
  left={${typeof left === "string" ? left : "{/* Left content */}"}}
  right={${typeof right === "string" ? right : "{/* Right content */}"}}
  ${leftWidth !== "1/2" ? `leftWidth="${leftWidth}"` : ""}
  ${gap !== 4 ? `gap={${gap}}` : ""}
  ${reverse ? "reverse" : ""}
/>`;
    }

    case "settings-page": {
      const { title = "Settings", tabs = [], defaultTab, maxWidth = "2xl" } = uiDsl;
      const tabsCode = tabs
        .map(
          (tab: any) =>
            `    { id: "${tab.id}", label: "${tab.label}", content: ${tab.content || "<div />"} }`
        )
        .join(",\n");
      return `import { SettingsPageLayout } from "@fragment_ui/scaffolds";

<SettingsPageLayout
  title="${title}"
  ${defaultTab ? `defaultTab="${defaultTab}"` : ""}
  ${maxWidth !== "2xl" ? `maxWidth="${maxWidth}"` : ""}
  tabs={[\n${tabsCode}\n  ]}
/>`;
    }

    default:
      throw new Error(`Scaffold generation not implemented for: ${scaffoldName}`);
  }
}

