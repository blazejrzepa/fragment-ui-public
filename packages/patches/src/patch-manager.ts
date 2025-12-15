/**
 * Patch Manager
 * 
 * Manages overlay patches for upstream (shadcn/ui) components
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import type { PatchFile, PatchMetadata, PatchResult, Conflict } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../../../..");
const PATCHES_DIR = path.join(ROOT, "packages/patches/patches");
const UI_SRC_DIR = path.join(ROOT, "packages/ui/src");

/**
 * Load patch file
 */
export async function loadPatch(patchId: string): Promise<PatchFile | null> {
  try {
    const patchPath = path.join(PATCHES_DIR, `${patchId}.json`);
    const content = await fs.readFile(patchPath, "utf-8");
    return JSON.parse(content) as PatchFile;
  } catch (error) {
    return null;
  }
}

/**
 * Save patch file
 */
export async function savePatch(patch: PatchFile): Promise<void> {
  await fs.mkdir(PATCHES_DIR, { recursive: true });
  const patchPath = path.join(PATCHES_DIR, `${patch.metadata.id}.json`);
  await fs.writeFile(patchPath, JSON.stringify(patch, null, 2), "utf-8");
}

/**
 * List all patches
 */
export async function listPatches(): Promise<PatchMetadata[]> {
  try {
    const files = await fs.readdir(PATCHES_DIR);
    const patches: PatchMetadata[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const patch = await loadPatch(file.replace(".json", ""));
        if (patch) {
          patches.push(patch.metadata);
        }
      }
    }

    return patches.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    return [];
  }
}

/**
 * Apply a single patch
 */
export async function applyPatch(patchId: string): Promise<PatchResult> {
  const patch = await loadPatch(patchId);
  if (!patch) {
    return {
      success: false,
      patchId,
      file: "",
      applied: false,
      error: `Patch ${patchId} not found`,
    };
  }

  const targetPath = path.join(UI_SRC_DIR, patch.targetFile);
  
  try {
    // Read current file
    const currentContent = await fs.readFile(targetPath, "utf-8");
    const lines = currentContent.split("\n");

    // Check for conflicts
    const conflicts: Conflict[] = [];
    let newLines = [...lines];

    // Apply changes in reverse order (to maintain line numbers)
    const sortedChanges = [...patch.changes].sort((a, b) => b.line - a.line);

    for (const change of sortedChanges) {
      const lineIndex = change.line - 1; // Convert to 0-based index

      switch (change.type) {
        case "insert":
          if (change.newContent) {
            newLines.splice(lineIndex, 0, change.newContent);
          }
          break;

        case "delete":
          if (change.oldContent && newLines[lineIndex]?.trim() !== change.oldContent.trim()) {
            conflicts.push({
              line: change.line,
              expected: change.oldContent,
              actual: newLines[lineIndex] || "",
            });
          } else {
            newLines.splice(lineIndex, 1);
          }
          break;

        case "replace":
          if (change.oldContent && newLines[lineIndex]?.trim() !== change.oldContent.trim()) {
            conflicts.push({
              line: change.line,
              expected: change.oldContent,
              actual: newLines[lineIndex] || "",
            });
          } else if (change.newContent) {
            newLines[lineIndex] = change.newContent;
          }
          break;
      }
    }

    if (conflicts.length > 0) {
      return {
        success: false,
        patchId,
        file: patch.targetFile,
        applied: false,
        conflicts,
      };
    }

    // Write patched file
    await fs.writeFile(targetPath, newLines.join("\n"), "utf-8");

    // Update patch metadata
    patch.metadata.updatedAt = Date.now();
    await savePatch(patch);

    return {
      success: true,
      patchId,
      file: patch.targetFile,
      applied: true,
    };
  } catch (error) {
    return {
      success: false,
      patchId,
      file: patch.targetFile,
      applied: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Apply all patches for a component
 */
export async function applyPatchesForComponent(componentName: string): Promise<PatchResult[]> {
  const patches = await listPatches();
  const componentPatches = patches.filter((p) => p.componentName === componentName);

  const results: PatchResult[] = [];
  for (const patch of componentPatches) {
    const result = await applyPatch(patch.id);
    results.push(result);
  }

  return results;
}

/**
 * Create a new patch from diff
 */
export async function createPatch(
  componentName: string,
  targetFile: string,
  upstreamContent: string,
  fragmentContent: string,
  description: string,
  reason: string,
  author: string = "system"
): Promise<string> {
  const patchId = `${componentName}-${Date.now()}`;
  
  // Simple diff algorithm (in production, use a proper diff library)
  const upstreamLines = upstreamContent.split("\n");
  const fragmentLines = fragmentContent.split("\n");
  const changes: PatchFile["changes"] = [];

  // Find differences (simplified - in production use proper diff algorithm)
  const maxLength = Math.max(upstreamLines.length, fragmentLines.length);
  
  for (let i = 0; i < maxLength; i++) {
    const upstreamLine = upstreamLines[i];
    const fragmentLine = fragmentLines[i];

    if (upstreamLine !== fragmentLine) {
      if (upstreamLine === undefined) {
        // Line added in fragment
        changes.push({
          type: "insert",
          line: i + 1,
          newContent: fragmentLine,
        });
      } else if (fragmentLine === undefined) {
        // Line removed in fragment
        changes.push({
          type: "delete",
          line: i + 1,
          oldContent: upstreamLine,
        });
      } else {
        // Line modified
        changes.push({
          type: "replace",
          line: i + 1,
          oldContent: upstreamLine,
          newContent: fragmentLine,
        });
      }
    }
  }

  const patch: PatchFile = {
    metadata: {
      id: patchId,
      componentName,
      upstreamVersion: "latest",
      fragmentVersion: "1.8.0",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description,
      author,
      reason,
    },
    targetFile,
    patchType: "modify",
    changes,
  };

  await savePatch(patch);
  return patchId;
}

/**
 * Check if patch can be applied (dry run)
 */
export async function checkPatch(patchId: string): Promise<{
  canApply: boolean;
  conflicts: Conflict[];
}> {
  const patch = await loadPatch(patchId);
  if (!patch) {
    return { canApply: false, conflicts: [] };
  }

  const targetPath = path.join(UI_SRC_DIR, patch.targetFile);
  const currentContent = await fs.readFile(targetPath, "utf-8");
  const lines = currentContent.split("\n");

  const conflicts: Conflict[] = [];

  for (const change of patch.changes) {
    const lineIndex = change.line - 1;

    if (change.type === "delete" || change.type === "replace") {
      if (change.oldContent && lines[lineIndex]?.trim() !== change.oldContent.trim()) {
        conflicts.push({
          line: change.line,
          expected: change.oldContent,
          actual: lines[lineIndex] || "",
        });
      }
    }
  }

  return {
    canApply: conflicts.length === 0,
    conflicts,
  };
}

