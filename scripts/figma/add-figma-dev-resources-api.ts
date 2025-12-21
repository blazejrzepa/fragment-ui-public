#!/usr/bin/env tsx

/**
 * Add Figma Dev Resources via REST API
 * 
 * This script uses Figma REST API to automatically add Dev Resources
 * to components. Requires FIGMA_TOKEN environment variable.
 * 
 * Usage:
 *   export FIGMA_TOKEN="your-token-here"
 *   tsx scripts/add-figma-dev-resources-api.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../");

const FIGMA_FILE_KEY = "dccfbPgHqbWW7K687i9Fv3";
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN;

interface DevResource {
  node_id: string;
  url: string;
  name: string;
}

interface ComponentResource {
  figmaNodeId: string;
  componentName: string;
  resources: DevResource[];
}

async function addDevResource(
  nodeId: string,
  url: string,
  name: string
): Promise<boolean> {
  if (!FIGMA_TOKEN) {
    console.error("❌ FIGMA_TOKEN not set. Set it with:");
    console.error("   export FIGMA_TOKEN='your-token-here'");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/dev_resources`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          node_id: nodeId,
          url: url,
          name: name,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Failed to add "${name}":`, error);
    return false;
  }
}

async function getExistingDevResources(nodeId: string): Promise<DevResource[]> {
  if (!FIGMA_TOKEN) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/dev_resources?node_ids=${nodeId}`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.meta?.dev_resources?.[nodeId] || [];
  } catch (error) {
    console.error(`⚠️ Failed to fetch existing resources:`, error);
    return [];
  }
}

async function addAllDevResources() {
  // Load component mappings from JSON
  const jsonPath = path.join(ROOT, ".figma-dev-resources.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ .figma-dev-resources.json not found. Run generate-figma-dev-resources.ts first.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const components: ComponentResource[] = data.components;

  console.log(`\n📦 Adding Dev Resources for ${components.length} components...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const component of components) {
    console.log(`\n🔧 ${component.componentName} (${component.figmaNodeId}):`);

    // Check existing resources
    const existing = await getExistingDevResources(component.figmaNodeId);
    const existingUrls = new Set(existing.map((r) => r.url));

    for (const resource of component.resources) {
      // Skip if already exists
      if (existingUrls.has(resource.url)) {
        console.log(`   ⏭️  Skipped "${resource.name}" (already exists)`);
        continue;
      }

      const success = await addDevResource(
        component.figmaNodeId,
        resource.url,
        resource.name
      );

      if (success) {
        console.log(`   ✅ Added "${resource.name}"`);
        successCount++;
      } else {
        console.log(`   ❌ Failed "${resource.name}"`);
        failCount++;
      }

      // Rate limiting - wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏭️  Skipped: ${components.length * 3 - successCount - failCount}`);

  if (failCount > 0) {
    console.log(`\n⚠️  Some resources failed to add. Check your FIGMA_TOKEN and file permissions.`);
    process.exit(1);
  }
}

// Check if token is available
if (!FIGMA_TOKEN) {
  console.log("⚠️  FIGMA_TOKEN not set. Using manual method instead.");
  console.log("\n📋 To use API method:");
  console.log("   1. Get Personal Access Token from Figma Settings");
  console.log("   2. Set: export FIGMA_TOKEN='your-token-here'");
  console.log("   3. Run this script again");
  console.log("\n📚 For manual setup, see: docs/guides/figma-dev-resources-manual-setup.md");
  process.exit(0);
}

// Run
addAllDevResources().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});

