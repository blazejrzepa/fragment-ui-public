#!/usr/bin/env node

/**
 * Apply patches CLI script
 */

import { applyPatch } from "./patch-manager.js";

const patchId = process.argv[2];

if (!patchId) {
  console.error("Usage: node apply-patches.js <patch-id>");
  process.exit(1);
}

const result = await applyPatch(patchId);

if (result.success) {
  console.log(`✅ Patch ${patchId} applied successfully`);
  process.exit(0);
} else {
  console.error(`❌ Failed to apply patch: ${result.error}`);
  if (result.conflicts) {
    console.error("Conflicts:");
    for (const conflict of result.conflicts) {
      console.error(`  Line ${conflict.line}: Expected "${conflict.expected}", got "${conflict.actual}"`);
    }
  }
  process.exit(1);
}

