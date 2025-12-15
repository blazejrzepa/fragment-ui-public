/**
 * CLI commands for patch management
 */

import { 
  listPatches as listPatchesFromPatches, 
  applyPatch as applyPatchFromPatches, 
  checkPatch as checkPatchFromPatches 
} from "@fragment_ui/patches";

export async function listPatchesCommand() {
  const patches = await listPatchesFromPatches();
  
  if (patches.length === 0) {
    console.log("No patches found.");
    return;
  }

  console.log("\n📋 Available Patches:\n");
  for (const patch of patches) {
    console.log(`  ${patch.id}`);
    console.log(`    Component: ${patch.componentName}`);
    console.log(`    Description: ${patch.description}`);
    console.log(`    Reason: ${patch.reason}`);
    console.log(`    Created: ${new Date(patch.createdAt).toLocaleDateString()}\n`);
  }
}

export async function applyPatch(patchId: string) {
  if (!patchId) {
    console.error("Usage: ds patch apply <patch-id>");
    process.exit(1);
  }

  const result = await applyPatchFromPatches(patchId);
  
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
}

export async function checkPatch(patchId: string) {
  if (!patchId) {
    console.error("Usage: ds patch check <patch-id>");
    process.exit(1);
  }

  const check = await checkPatchFromPatches(patchId);
  
  if (check.canApply) {
    console.log(`✅ Patch ${patchId} can be applied`);
  } else {
    console.error(`❌ Patch ${patchId} has conflicts:`);
    for (const conflict of check.conflicts) {
      console.error(`  Line ${conflict.line}: Expected "${conflict.expected}", got "${conflict.actual}"`);
    }
    process.exit(1);
  }
}

