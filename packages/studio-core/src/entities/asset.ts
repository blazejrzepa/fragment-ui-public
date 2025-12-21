/**
 * Asset entity - reusable artifact in Fragment UI ecosystem
 */

import type { LifecycleState } from "./lifecycle-state";

export type AssetType = 
  | "component" 
  | "block" 
  | "screen" 
  | "page" 
  | "flow" 
  | "tokenSet" 
  | "theme";

export interface Asset {
  id: string;                    // UUID v4 - stable identifier
  type: AssetType;
  name: string;
  description?: string;
  tags: string[];
  source: "dsl" | "tsx" | "figma" | "imported";
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  updatedAt?: string;            // ISO 8601
  lifecycleState: LifecycleState;
  
  // Ownership & Governance
  owner?: string;                // User/team ID
  projectId?: string;
  orgId?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

export function createAsset(params: {
  type: AssetType;
  name: string;
  description?: string;
  tags?: string[];
  source?: Asset["source"];
  createdBy: string;
  owner?: string;
  projectId?: string;
  orgId?: string;
}): Asset {
  return {
    id: crypto.randomUUID(),
    type: params.type,
    name: params.name,
    description: params.description,
    tags: params.tags ?? [],
    source: params.source ?? "dsl",
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    lifecycleState: "draft",
    owner: params.owner,
    projectId: params.projectId,
    orgId: params.orgId,
    metadata: {}
  };
}

