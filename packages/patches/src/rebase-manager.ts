/**
 * Rebase Manager
 * 
 * Manages periodic rebase process for upstream (shadcn/ui) updates
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { RebaseInfo, PatchMetadata, Conflict } from "./types.js";
import { listPatches, applyPatch, checkPatch } from "./patch-manager.js";

const REBASE_HISTORY_FILE = path.join(process.cwd(), ".rebase-history.json");

/**
 * Load rebase history
 */
export async function loadRebaseHistory(): Promise<RebaseInfo[]> {
  try {
    const content = await fs.readFile(REBASE_HISTORY_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save rebase history
 */
export async function saveRebaseHistory(history: RebaseInfo[]): Promise<void> {
  await fs.writeFile(REBASE_HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

/**
 * Start rebase process
 */
export async function startRebase(
  fromVersion: string,
  toVersion: string
): Promise<RebaseInfo> {
  const patches = await listPatches();
  const conflicts: Conflict[] = [];

  // Check all patches for conflicts
  for (const patch of patches) {
    const check = await checkPatch(patch.id);
    if (!check.canApply) {
      conflicts.push(...check.conflicts);
    }
  }

  const rebaseInfo: RebaseInfo = {
    fromVersion,
    toVersion,
    patches,
    conflicts,
    status: conflicts.length > 0 ? "pending" : "in-progress",
  };

  const history = await loadRebaseHistory();
  history.push(rebaseInfo);
  await saveRebaseHistory(history);

  return rebaseInfo;
}

/**
 * Apply rebase (apply all patches after upstream update)
 */
export async function applyRebase(rebaseId: string): Promise<{
  success: boolean;
  applied: number;
  failed: number;
  conflicts: Conflict[];
}> {
  const history = await loadRebaseHistory();
  const rebase = history.find((r) => r.fromVersion === rebaseId);

  if (!rebase) {
    throw new Error(`Rebase ${rebaseId} not found`);
  }

  let applied = 0;
  let failed = 0;
  const allConflicts: Conflict[] = [];

  for (const patch of rebase.patches) {
    const result = await applyPatch(patch.id);
    if (result.applied) {
      applied++;
    } else {
      failed++;
      if (result.conflicts) {
        allConflicts.push(...result.conflicts);
      }
    }
  }

  rebase.status = allConflicts.length > 0 ? "failed" : "completed";
  await saveRebaseHistory(history);

  return {
    success: allConflicts.length === 0,
    applied,
    failed,
    conflicts: allConflicts,
  };
}

/**
 * Generate rebase report
 */
export async function generateRebaseReport(): Promise<string> {
  const history = await loadRebaseHistory();
  const patches = await listPatches();

  let report = "# Rebase Report\n\n";
  report += `**Total Patches:** ${patches.length}\n`;
  report += `**Rebase History:** ${history.length} rebases\n\n`;

  report += "## Recent Rebases\n\n";
  for (const rebase of history.slice(-5)) {
    report += `### ${rebase.fromVersion} → ${rebase.toVersion}\n`;
    report += `- Status: ${rebase.status}\n`;
    report += `- Patches: ${rebase.patches.length}\n`;
    report += `- Conflicts: ${rebase.conflicts.length}\n\n`;
  }

  report += "## Active Patches\n\n";
  for (const patch of patches) {
    report += `### ${patch.componentName} (${patch.id})\n`;
    report += `- Description: ${patch.description}\n`;
    report += `- Reason: ${patch.reason}\n`;
    report += `- Created: ${new Date(patch.createdAt).toLocaleDateString()}\n\n`;
  }

  return report;
}

