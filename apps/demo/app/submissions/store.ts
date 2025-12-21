/**
 * Simple file-based storage for Submissions
 * 
 * Uses JSON file for persistence. In production, this should be replaced
 * with a proper database (e.g., PostgreSQL, MongoDB).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { Submission } from "./types";

const DB_DIR = join(process.cwd(), "data");
const DB_FILE = join(DB_DIR, "submissions.json");

/**
 * List all submissions
 */
export async function list(): Promise<Submission[]> {
  try {
    const content = await readFile(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist yet, return empty array
      return [];
    }
    throw error;
  }
}

/**
 * Save all submissions
 */
export async function save(all: Submission[]): Promise<void> {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(all, null, 2), "utf8");
}

/**
 * Upsert a submission (insert or update)
 */
export async function upsert(item: Submission): Promise<Submission> {
  const all = await list();
  const index = all.findIndex((x) => x.id === item.id);
  
  const updatedItem = {
    ...item,
    updatedAt: new Date().toISOString(),
  };
  
  if (index >= 0) {
    all[index] = updatedItem;
  } else {
    all.push(updatedItem);
  }
  
  await save(all);
  return updatedItem;
}

/**
 * Find submission by ID
 */
export async function findById(id: string): Promise<Submission | null> {
  const all = await list();
  return all.find((x) => x.id === id) || null;
}

/**
 * Delete submission by ID
 */
export async function deleteById(id: string): Promise<boolean> {
  const all = await list();
  const index = all.findIndex((x) => x.id === id);
  
  if (index >= 0) {
    all.splice(index, 1);
    await save(all);
    return true;
  }
  
  return false;
}

