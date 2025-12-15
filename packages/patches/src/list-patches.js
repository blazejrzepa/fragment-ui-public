#!/usr/bin/env node

/**
 * List patches CLI script
 */

import { listPatches } from "./patch-manager.js";

const patches = await listPatches();

console.log("\n📋 Available Patches:\n");

if (patches.length === 0) {
  console.log("  No patches found.\n");
} else {
  for (const patch of patches) {
    console.log(`  ${patch.id}`);
    console.log(`    Component: ${patch.componentName}`);
    console.log(`    Description: ${patch.description}`);
    console.log(`    Reason: ${patch.reason}`);
    console.log(`    Created: ${new Date(patch.createdAt).toLocaleDateString()}\n`);
  }
}

