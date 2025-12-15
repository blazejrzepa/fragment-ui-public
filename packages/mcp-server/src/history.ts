/**
 * MCP History Tools
 * 
 * Tools for managing history (undo/redo, commits, branches) for UI-DSL.
 * Used by AI agents (Cursor/Copilot) to manage editing history.
 */

// Type definitions (simplified for MCP server)
export interface Commit {
  id: string;
  timestamp: number;
  message?: string;
  author?: string;
  patches: any[];
  dslBefore: any;
  dslAfter: any;
  parentId?: string;
  branch?: string;
}

export interface History {
  commits: Commit[];
  currentIndex: number;
  branches: Record<string, number>;
  currentBranch: string;
}

/**
 * List commits in history
 */
export function listCommits(
  history: History,
  options?: {
    branch?: string;
    limit?: number;
    offset?: number;
  }
): Commit[] {
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
 * Get commit by ID
 */
export function getCommit(history: History, commitId: string): Commit | null {
  return history.commits.find(c => c.id === commitId) || null;
}

/**
 * Checkout a specific commit
 */
export function checkoutCommit(history: History, commitId: string): {
  ok: boolean;
  history: History;
  dsl: any | null;
  error?: string;
} {
  const commitIndex = history.commits.findIndex(c => c.id === commitId);
  
  if (commitIndex === -1) {
    return {
      ok: false,
      history,
      dsl: null,
      error: `Commit not found: ${commitId}`,
    };
  }
  
  const newHistory = { ...history };
  newHistory.currentIndex = commitIndex;
  
  const dsl = newHistory.commits[commitIndex].dslAfter;
  
  return {
    ok: true,
    history: newHistory,
    dsl,
  };
}

/**
 * Get current commit
 */
export function getCurrentCommit(history: History): Commit | null {
  if (history.currentIndex < 0 || history.currentIndex >= history.commits.length) {
    return null;
  }
  
  return history.commits[history.currentIndex];
}

/**
 * Get branches
 */
export function getBranches(history: History): string[] {
  return Object.keys(history.branches);
}

/**
 * Get current branch
 */
export function getCurrentBranch(history: History): string {
  return history.currentBranch;
}
