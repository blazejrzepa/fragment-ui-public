#!/usr/bin/env tsx

/**
 * Generate Figma Dev Resources documentation
 * 
 * This script generates a markdown file with instructions for manually
 * adding Dev Resources to Figma components (alternative to Code Connect
 * which requires Enterprise plan).
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../");

interface ComponentMapping {
  figmaNodeId: string;
  componentName: string;
  codePath: string;
  docsPath?: string;
  /**
   * Storybook route id, e.g. /docs/core-button--docs or /story/core-button--default
   */
  storybookPath?: string;
  variants?: Record<string, string[]>;
}

// Component mappings - add more entries as node IDs become available
// To get Figma Node ID:
// 1. Open component in Figma
// 2. Right-click → Copy/Paste as → Copy link
// 3. Extract node-id from URL (e.g., ?node-id=1304-13481)
const mappings: ComponentMapping[] = [
  {
    figmaNodeId: "1304-13481",
    componentName: "Button",
    codePath: "packages/ui/src/button.tsx",
    docsPath: "apps/www/app/docs/components/button/page.tsx",
    storybookPath: "/docs/core-button--docs",
    variants: {
      variant: ["solid", "outline", "ghost"],
      size: ["sm", "md", "lg"],
    },
  },
  {
    figmaNodeId: "TODO-CARD-NODE-ID", // TODO: Replace with actual Figma node ID for Card
    componentName: "Card",
    codePath: "packages/ui/src/card.tsx",
    docsPath: "apps/www/app/docs/components/card/page.tsx",
    storybookPath: "/docs/display-card--docs",
    variants: {
      // Card typically doesn't have variants, but can have different compositions
    },
  },
  {
    figmaNodeId: "TODO-DIALOG-NODE-ID", // TODO: Replace with actual Figma node ID for Dialog
    componentName: "Dialog",
    codePath: "packages/ui/src/dialog.tsx",
    docsPath: "apps/www/app/docs/components/dialog/page.tsx",
    storybookPath: "/docs/core-dialog--docs",
    variants: {
      // Dialog variants if any in Figma
    },
  },
  {
    figmaNodeId: "TODO-SELECT-NODE-ID", // TODO: Replace with actual Figma node ID for Select
    componentName: "Select",
    codePath: "packages/ui/src/select.tsx",
    docsPath: "apps/www/app/docs/components/select/page.tsx",
    storybookPath: "/docs/core-select--docs",
    variants: {
      // Select variants if any in Figma
    },
  },
];

const baseUrl = "https://github.com/blazejrzepa/fragment-ui/blob/main";
const docsBaseUrl = "https://fragment-ui-www.vercel.app/docs/components";
const storybookBaseUrl = "https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com";
const figmaFileUrl = "https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System";

function generateDevResourcesMarkdown() {
  let markdown = `# Figma Dev Resources - Manual Setup Guide

> **Alternative to Code Connect** (which requires Enterprise plan)
> 
> This guide shows how to manually add Dev Resources to Figma components
> to achieve similar functionality to Code Connect.

## 📋 Overview

Dev Resources allow you to add links to code, documentation, and other resources
directly to Figma components. This works with **Professional plan** and doesn't
require Enterprise.

## 🚀 Quick Setup

### Step 1: Enable Dev Mode

1. Open Figma
2. Press \`Shift + D\` or click **"Dev Mode"** toggle in top right
3. Dev Mode is now enabled

### Step 2: Add Dev Resources

1. **Click on a component** in Figma (e.g., Button)
2. In the **right panel**, find **"Dev Resources"** section
3. Click **"+ Add"** button
4. Paste one of the links below for that component
5. Repeat for all resources (code, docs, storybook)

### Step 3: Verify

1. Click on component again
2. Check that Dev Resources section shows all links
3. Click on links to verify they work

---

## 📦 Component Mappings

`;

  for (const mapping of mappings) {
    const componentSlug = mapping.componentName.toLowerCase();
    const hasValidNodeId = !mapping.figmaNodeId.startsWith("TODO-");
    const figmaUrl = hasValidNodeId 
      ? `${figmaFileUrl}?node-id=${mapping.figmaNodeId}`
      : `${figmaFileUrl}`;
    
    markdown += `### ${mapping.componentName}\n\n`;
    
    if (hasValidNodeId) {
      markdown += `**Figma Component:** [View in Figma](${figmaUrl})\n\n`;
      markdown += `**Node ID:** \`${mapping.figmaNodeId}\`\n\n`;
    } else {
      markdown += `⚠️ **Node ID Required:** Replace \`${mapping.figmaNodeId}\` with actual Figma node ID\n\n`;
      markdown += `**How to get Node ID:**\n`;
      markdown += `1. Open component in Figma\n`;
      markdown += `2. Right-click → Copy/Paste as → Copy link\n`;
      markdown += `3. Extract node-id from URL (e.g., ?node-id=1304-13481)\n`;
      markdown += `4. Update this script with the node ID\n\n`;
    }
    
    markdown += `**Dev Resources to add:**\n\n`;
    
    // Code link
    markdown += `1. **Component Code**\n`;
    markdown += `   - Label: "Component Code" or "${mapping.componentName} Code"\n`;
    markdown += `   - URL: \`${baseUrl}/${mapping.codePath}\`\n\n`;
    
    // Documentation link
    if (mapping.docsPath) {
      markdown += `2. **Documentation**\n`;
      markdown += `   - Label: "Documentation" or "${mapping.componentName} Docs"\n`;
      markdown += `   - URL: \`${docsBaseUrl}/${componentSlug}\`\n\n`;
    }
    
    // Storybook link
    if (mapping.storybookPath) {
      const pathWithLeadingSlash = mapping.storybookPath.startsWith("/")
        ? mapping.storybookPath
        : `/${mapping.storybookPath}`;
      markdown += `3. **Storybook**\n`;
      markdown += `   - Label: "Storybook" or "${mapping.componentName} Story"\n`;
      markdown += `   - URL: \`${storybookBaseUrl}?path=${encodeURIComponent(pathWithLeadingSlash)}\`\n\n`;
    }
    
    // Variants mapping
    if (mapping.variants) {
      markdown += `**Variant Mapping:**\n\n`;
      markdown += `| Figma Variant | Code Prop |\n`;
      markdown += `|---------------|-----------|\n`;
      
      for (const [prop, values] of Object.entries(mapping.variants)) {
        for (const value of values) {
          markdown += `| \`${prop}=${value}\` | \`${prop}="${value}"\` |\n`;
        }
      }
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  }

  markdown += `## 🔄 Automation (Optional)

If you have a Figma Personal Access Token, you can automate adding Dev Resources
using the Figma REST API. See \`scripts/add-figma-dev-resources-api.ts\` for
implementation.

## 📚 Related Documentation

- [Figma Dev Resources Guide](https://help.figma.com/hc/en-us/articles/360055203533)
- [Figma REST API - Dev Resources](https://www.figma.com/developers/api#dev-resources-endpoints)
- [Alternative Code Connect Solutions](../guides/figma-code-connect-alternatives.md)

---

*Generated: ${new Date().toISOString()}*\n`;

  const outputPath = path.join(ROOT, "docs/guides/figma-dev-resources-manual-setup.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`✅ Generated: ${outputPath}`);
}

// Also generate JSON for API usage
function generateDevResourcesJSON() {
  const json = {
    components: mappings
      .filter((mapping) => !mapping.figmaNodeId.startsWith("TODO-")) // Skip components without node IDs
      .map((mapping) => ({
        figmaNodeId: mapping.figmaNodeId,
        name: mapping.componentName,
        figmaUrl: `${figmaFileUrl}?node-id=${mapping.figmaNodeId}`,
        resources: [
          {
            type: "code",
            url: `${baseUrl}/${mapping.codePath}`,
            label: `${mapping.componentName} Component Code`,
          },
          ...(mapping.docsPath
            ? [
                {
                  type: "docs",
                  url: `${docsBaseUrl}/${mapping.componentName.toLowerCase()}`,
                  label: `${mapping.componentName} Documentation`,
                },
              ]
            : []),
          ...(mapping.storybookPath
            ? [
                {
                  type: "storybook",
                  url: `${storybookBaseUrl}?path=${encodeURIComponent(
                    mapping.storybookPath.startsWith("/")
                      ? mapping.storybookPath
                      : `/${mapping.storybookPath}`
                  )}`,
                  label: `${mapping.componentName} Storybook`,
                },
              ]
            : []),
        ],
        variants: mapping.variants || {},
      })),
    pending: mappings
      .filter((mapping) => mapping.figmaNodeId.startsWith("TODO-"))
      .map((mapping) => ({
        componentName: mapping.componentName,
        codePath: mapping.codePath,
        docsPath: mapping.docsPath,
        storybookPath: mapping.storybookPath,
        note: "Node ID required - update script with Figma node ID",
      })),
  };

  const outputPath = path.join(ROOT, ".figma-dev-resources.json");
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
  console.log(`✅ Generated: ${outputPath}`);
}

// Run
generateDevResourcesMarkdown();
generateDevResourcesJSON();

const pendingComponents = mappings.filter((m) => m.figmaNodeId.startsWith("TODO-"));
const readyComponents = mappings.filter((m) => !m.figmaNodeId.startsWith("TODO-"));

console.log("\n✅ Dev Resources generation complete!");
console.log(`\n📊 Summary:`);
console.log(`   ✅ Ready: ${readyComponents.length} components`);
console.log(`   ⏳ Pending: ${pendingComponents.length} components (need Figma node IDs)`);

if (pendingComponents.length > 0) {
  console.log(`\n⚠️  Components needing Figma node IDs:`);
  pendingComponents.forEach((m) => {
    console.log(`   - ${m.componentName} (${m.figmaNodeId})`);
  });
  console.log(`\n📋 To get Node IDs:`);
  console.log(`   1. Open component in Figma`);
  console.log(`   2. Right-click → Copy/Paste as → Copy link`);
  console.log(`   3. Extract node-id from URL`);
  console.log(`   4. Update this script and run again`);
}

console.log(`\n📋 Next steps:`);
console.log(`   1. Update Figma node IDs for pending components (if needed)`);
console.log(`   2. Follow instructions in docs/guides/figma-dev-resources-manual-setup.md`);
console.log(`   3. Or use API: pnpm figma:dev-resources:add (requires FIGMA_TOKEN)`);

