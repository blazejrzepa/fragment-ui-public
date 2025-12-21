/**
 * History API for UI-DSL
 * 
 * Manages undo/redo and commit history for UI-DSL editing.
 * Each commit contains a patch and metadata (timestamp, message, author).
 * 
 * v1.1: History system for conversational UI editing.
 */

import type { UiDsl } from './types';
import type { Patch } from './patch';
import { applyPatches } from './patch';
import { generateId } from './types';

/**
 * Commit metadata
 */
export interface Commit {
  id: string;                    // UUID v4
  timestamp: number;             // Unix timestamp
  message?: string;              // Optional commit message
  author?: string;                // Optional author (e.g., "user", "copilot")
  patches: Patch[];               // Patches applied in this commit
  dslBefore: UiDsl;              // DSL state before patches
  dslAfter: UiDsl;               // DSL state after patches
  parentId?: string;              // Parent commit ID (for branching)
  branch?: string;                // Branch name (default: "main")
}

/**
 * History state
 */
export interface History {
  commits: Commit[];              // All commits (chronological)
  currentIndex: number;          // Current position in history (-1 = no commits)
  branches: Record<string, number>; // Branch name -> commit index
  currentBranch: string;          // Current branch name
}

/**
 * Create a new history instance
 */
export function createHistory(): History {
  return {
    commits: [],
    currentIndex: -1,
    branches: { main: -1 },
    currentBranch: 'main',
  };
}

/**
 * Create a commit from patches
 */
export function createCommit(
  patches: Patch[],
  dslBefore: UiDsl,
  dslAfter: UiDsl,
  options?: {
    message?: string;
    author?: string;
    branch?: string;
  }
): Commit {
  return {
    id: generateId(),
    timestamp: Date.now(),
    message: options?.message,
    author: options?.author || 'user',
    patches,
    dslBefore: JSON.parse(JSON.stringify(dslBefore)), // Deep clone
    dslAfter: JSON.parse(JSON.stringify(dslAfter)), // Deep clone
    branch: options?.branch || 'main',
  };
}

/**
 * Add a commit to history
 */
export function addCommit(history: History, commit: Commit): History {
  const newHistory = { ...history };
  
  // Remove any commits after currentIndex (if we're not at the end)
  if (newHistory.currentIndex < newHistory.commits.length - 1) {
    newHistory.commits = newHistory.commits.slice(0, newHistory.currentIndex + 1);
  }
  
  // Add new commit
  newHistory.commits.push(commit);
  newHistory.currentIndex = newHistory.commits.length - 1;
  
  // Update branch pointer
  newHistory.branches[commit.branch || 'main'] = newHistory.currentIndex;
  
  return newHistory;
}

/**
 * Apply patches and create a commit
 */
export function commitPatches(
  history: History,
  patches: Patch[],
  currentDsl: UiDsl,
  options?: {
    message?: string;
    author?: string;
    branch?: string;
  }
): { history: History; dsl: UiDsl; commit: Commit } {
  const dslBefore = currentDsl;
  const dslAfter = applyPatches(dslBefore, patches);
  
  const commit = createCommit(patches, dslBefore, dslAfter, {
    ...options,
    branch: options?.branch || history.currentBranch,
  });
  
  // Set parent ID
  if (history.currentIndex >= 0) {
    commit.parentId = history.commits[history.currentIndex].id;
  }
  
  const newHistory = addCommit(history, commit);
  
  return {
    history: newHistory,
    dsl: dslAfter,
    commit,
  };
}

/**
 * Undo - go back one commit
 */
export function undo(history: History): { history: History; dsl: UiDsl | null } {
  if (history.currentIndex < 0) {
    return { history, dsl: null };
  }
  
  const newHistory = { ...history };
  newHistory.currentIndex = Math.max(-1, newHistory.currentIndex - 1);
  
  // Get DSL from before the current commit
  const dsl = newHistory.currentIndex >= 0
    ? newHistory.commits[newHistory.currentIndex].dslAfter
    : (newHistory.commits.length > 0 ? newHistory.commits[0].dslBefore : null);
  
  return { history: newHistory, dsl };
}

/**
 * Redo - go forward one commit
 */
export function redo(history: History): { history: History; dsl: UiDsl | null } {
  if (history.currentIndex >= history.commits.length - 1) {
    return { history, dsl: null };
  }
  
  const newHistory = { ...history };
  newHistory.currentIndex = Math.min(newHistory.commits.length - 1, newHistory.currentIndex + 1);
  
  const dsl = newHistory.commits[newHistory.currentIndex].dslAfter;
  
  return { history: newHistory, dsl };
}

/**
 * Get current DSL from history
 */
export function getCurrentDsl(history: History): UiDsl | null {
  if (history.currentIndex < 0) {
    return history.commits.length > 0 ? history.commits[0].dslBefore : null;
  }
  
  return history.commits[history.currentIndex].dslAfter;
}

/**
 * Checkout a specific commit
 */
export function checkout(history: History, commitId: string): { history: History; dsl: UiDsl | null } {
  const commitIndex = history.commits.findIndex(c => c.id === commitId);
  
  if (commitIndex === -1) {
    return { history, dsl: null };
  }
  
  const newHistory = { ...history };
  newHistory.currentIndex = commitIndex;
  
  const dsl = newHistory.commits[commitIndex].dslAfter;
  
  return { history: newHistory, dsl };
}

/**
 * Get commit list
 */
export function getCommits(history: History, options?: {
  branch?: string;
  limit?: number;
  offset?: number;
}): Commit[] {
  let commits = history.commits;
  
  // Filter by branch if specified
  if (options?.branch) {
    commits = commits.filter(c => c.branch === options.branch);
  }
  
  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit;
  
  if (limit !== undefined) {
    commits = commits.slice(offset, offset + limit);
  } else if (offset > 0) {
    commits = commits.slice(offset);
  }
  
  return commits;
}

/**
 * Create a new branch from current commit
 */
export function createBranch(history: History, branchName: string): History {
  const newHistory = { ...history };
  
  if (!newHistory.branches[branchName]) {
    newHistory.branches[branchName] = newHistory.currentIndex;
  }
  
  return newHistory;
}

/**
 * Switch to a branch
 */
export function switchBranch(history: History, branchName: string): { history: History; dsl: UiDsl | null } {
  const branchIndex = history.branches[branchName];
  
  if (branchIndex === undefined) {
    return { history, dsl: null };
  }
  
  const newHistory = { ...history };
  newHistory.currentBranch = branchName;
  newHistory.currentIndex = branchIndex;
  
  const dsl = branchIndex >= 0 ? newHistory.commits[branchIndex].dslAfter : null;
  
  return { history: newHistory, dsl };
}

