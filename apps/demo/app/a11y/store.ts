/**
 * Simple file-based storage for A11y Stats
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { A11yStats } from "./types";

const DB_DIR = join(process.cwd(), "data");
const DB_FILE = join(DB_DIR, "a11y.json");

/**
 * List all a11y stats
 */
export async function list(): Promise<A11yStats[]> {
  try {
    const content = await readFile(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Save all a11y stats
 */
export async function save(all: A11yStats[]): Promise<void> {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(all, null, 2), "utf8");
}

/**
 * Add a new a11y stat
 */
export async function add(stat: A11yStats): Promise<A11yStats> {
  const all = await list();
  all.push(stat);
  await save(all);
  return stat;
}

/**
 * Get stats by submission ID
 */
export async function getBySubmissionId(submissionId: string): Promise<A11yStats[]> {
  const all = await list();
  return all.filter((s) => s.submissionId === submissionId);
}

/**
 * Get recent stats (last N)
 */
export async function getRecent(limit: number = 50): Promise<A11yStats[]> {
  const all = await list();
  return all
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

