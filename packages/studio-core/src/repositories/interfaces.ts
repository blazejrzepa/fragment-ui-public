/**
 * Repository interfaces for domain entities
 */

import type { Asset } from "../entities/asset";
import type { Revision } from "../entities/revision";
import type { CheckResult } from "../entities/check-result";
import type { Experiment } from "../entities/experiment";

// Asset Repository
export interface AssetRepository {
  create(asset: Asset): Promise<Asset>;
  findById(id: string): Promise<Asset | null>;
  findByType(type: Asset["type"]): Promise<Asset[]>;
  findByProject(projectId: string): Promise<Asset[]>;
  update(id: string, updates: Partial<Asset>): Promise<Asset>;
  delete(id: string): Promise<void>;
}

// Revision Repository
export interface RevisionRepository {
  create(revision: Revision): Promise<Revision>;
  findById(revisionId: string): Promise<Revision | null>;
  findByAssetId(assetId: string): Promise<Revision[]>;
  findLatestByAssetId(assetId: string): Promise<Revision | null>;
  findByParent(parentRevisionId: string): Promise<Revision[]>;
  update(revisionId: string, updates: Partial<Revision>): Promise<Revision>;
  delete(revisionId: string): Promise<void>;
}

// Submission Repository (for Phase 3)
export interface Submission {
  id: string;
  revisionId: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  createdBy: string;
}

export interface SubmissionRepository {
  create(submission: Submission): Promise<Submission>;
  findById(id: string): Promise<Submission | null>;
  findByRevisionId(revisionId: string): Promise<Submission | null>;
  findByStatus(status: Submission["status"]): Promise<Submission[]>;
  update(id: string, updates: Partial<Submission>): Promise<Submission>;
}

// Experiment Repository
export interface ExperimentRepository {
  create(experiment: Experiment): Promise<Experiment>;
  findById(id: string): Promise<Experiment | null>;
  findBySlug(slug: string): Promise<Experiment | null>;
  findByProject(projectId: string): Promise<Experiment[]>;
  findByStatus(status: Experiment["status"]): Promise<Experiment[]>;
  update(id: string, updates: Partial<Experiment>): Promise<Experiment>;
  delete(id: string): Promise<void>;
}

// Release Repository (for Phase 4)
export interface Release {
  id: string;
  revisionId: string;
  version: string;                // Semantic version (e.g., "1.2.3")
  changelog?: string;
  migrationNotes?: string;
  publishedAt?: string;
  publishedBy?: string;
  createdAt: string;
  createdBy: string;
}

export interface ReleaseRepository {
  create(release: Release): Promise<Release>;
  findById(id: string): Promise<Release | null>;
  findByVersion(version: string): Promise<Release | null>;
  findByRevisionId(revisionId: string): Promise<Release | null>;
  findLatest(): Promise<Release | null>;
  update(id: string, updates: Partial<Release>): Promise<Release>;
}

