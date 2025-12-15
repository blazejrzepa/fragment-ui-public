/**
 * Types for overlay patches system
 */

export interface PatchMetadata {
  id: string;
  componentName: string;
  upstreamVersion: string;
  fragmentVersion: string;
  createdAt: number;
  updatedAt: number;
  description: string;
  author: string;
  reason: string; // Why this patch is needed
  dependencies?: string[]; // Other patches this depends on
}

export interface PatchFile {
  metadata: PatchMetadata;
  targetFile: string; // Path to file in packages/ui/src
  patchType: "modify" | "add" | "remove" | "replace";
  changes: PatchChange[];
}

export interface PatchChange {
  type: "insert" | "delete" | "replace";
  line: number;
  oldContent?: string;
  newContent?: string;
  context?: {
    before?: string[];
    after?: string[];
  };
}

export interface PatchResult {
  success: boolean;
  patchId: string;
  file: string;
  applied: boolean;
  conflicts?: Conflict[];
  error?: string;
}

export interface Conflict {
  line: number;
  expected: string;
  actual: string;
  resolution?: "keep" | "apply" | "manual";
}

export interface RebaseInfo {
  fromVersion: string;
  toVersion: string;
  patches: PatchMetadata[];
  conflicts: Conflict[];
  status: "pending" | "in-progress" | "completed" | "failed";
}

