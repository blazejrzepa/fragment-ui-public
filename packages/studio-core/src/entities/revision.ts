/**
 * Revision entity - immutable snapshot of an Asset
 */

import type { UiPage, Patch as UiDslPatch } from "@fragment_ui/ui-dsl";

export interface RevisionMetadata {
  version?: string;
  notes?: string;
  [key: string]: any;
}

export interface Revision {
  revisionId: string;            // UUID v4 - unique per snapshot
  assetId: string;               // References Asset.id
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  
  // Content
  dslJson: UiPage;               // UI-DSL v2 structure (UiPage is the root type)
  tsxCode: string;               // Generated TSX code
  metadata: RevisionMetadata;
  previewArtifacts?: {
    screenshot?: string;         // Base64 or URL
    bundleSize?: number;
    renderTime?: number;
  };
  
  // Context
  parentRevisionId?: string;     // For patch-based revisions
  patches?: UiDslPatch[];        // Patches applied to create this revision
  prompt?: string;               // Original prompt (if AI-generated)
  chatSessionId?: string;        // Link to chat context
}

export function createRevision(params: {
  assetId: string;
  dslJson: UiPage;
  tsxCode: string;
  createdBy: string;
  parentRevisionId?: string;
  patches?: UiDslPatch[];
  prompt?: string;
  chatSessionId?: string;
  metadata?: RevisionMetadata;
}): Revision {
  return {
    revisionId: crypto.randomUUID(),
    assetId: params.assetId,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    dslJson: params.dslJson,
    tsxCode: params.tsxCode,
    metadata: params.metadata ?? {},
    parentRevisionId: params.parentRevisionId,
    patches: params.patches,
    prompt: params.prompt,
    chatSessionId: params.chatSessionId
  };
}

