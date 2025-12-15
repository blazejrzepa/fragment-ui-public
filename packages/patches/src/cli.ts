#!/usr/bin/env node

/**
 * CLI for patch management
 */

import { listPatches, applyPatch, createPatch, checkPatch } from "./patch-manager.js";
import { startRebase, applyRebase, generateRebaseReport } from "./rebase-manager.js";

const command = process.argv[2];

async function main() {
  switch (command) {
    case "list":
      const patches = await listPatches();
      console.log("\n📋 Available Patches:\n");
      for (const patch of patches) {
        console.log(`  ${patch.id}`);
        console.log(`    Component: ${patch.componentName}`);
        console.log(`    Description: ${patch.description}`);
        console.log(`    Reason: ${patch.reason}`);
        console.log(`    Created: ${new Date(patch.createdAt).toLocaleDateString()}\n`);
      }
      break;

    case "apply":
      const patchId = process.argv[3];
      if (!patchId) {
        console.error("Usage: patches apply <patch-id>");
        process.exit(1);
      }
      const result = await applyPatch(patchId);
      if (result.success) {
        console.log(`✅ Patch ${patchId} applied successfully`);
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
      break;

    case "check":
      const checkPatchId = process.argv[3];
      if (!checkPatchId) {
        console.error("Usage: patches check <patch-id>");
        process.exit(1);
      }
      const check = await checkPatch(checkPatchId);
      if (check.canApply) {
        console.log(`✅ Patch ${checkPatchId} can be applied`);
      } else {
        console.error(`❌ Patch ${checkPatchId} has conflicts:`);
        for (const conflict of check.conflicts) {
          console.error(`  Line ${conflict.line}: Expected "${conflict.expected}", got "${conflict.actual}"`);
        }
        process.exit(1);
      }
      break;

    case "rebase":
      const fromVersion = process.argv[3];
      const toVersion = process.argv[4];
      if (!fromVersion || !toVersion) {
        console.error("Usage: patches rebase <from-version> <to-version>");
        process.exit(1);
      }
      const rebase = await startRebase(fromVersion, toVersion);
      console.log(`\n🔄 Rebase started: ${fromVersion} → ${toVersion}`);
      console.log(`   Patches: ${rebase.patches.length}`);
      console.log(`   Conflicts: ${rebase.conflicts.length}`);
      if (rebase.conflicts.length > 0) {
        console.log("\n⚠️  Conflicts detected. Please resolve before applying rebase.");
      }
      break;

    case "report":
      const report = await generateRebaseReport();
      console.log(report);
      break;

    default:
      console.log(`
Fragment UI Patches CLI

Usage:
  patches list                    List all patches
  patches apply <patch-id>        Apply a patch
  patches check <patch-id>        Check if patch can be applied
  patches rebase <from> <to>      Start rebase process
  patches report                  Generate rebase report
      `);
  }
}

main().catch(console.error);

