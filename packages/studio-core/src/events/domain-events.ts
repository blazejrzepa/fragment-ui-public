/**
 * Domain events for cross-module communication
 */

import type { Asset } from "../entities/asset";
import type { Revision } from "../entities/revision";
import type { CheckResult } from "../entities/check-result";
import type { Experiment } from "../entities/experiment";

export type DomainEvent =
  | "AssetCreated"
  | "AssetUpdated"
  | "AssetDeleted"
  | "RevisionCreated"
  | "RevisionUpdated"
  | "SubmissionOpened"
  | "SubmissionApproved"
  | "SubmissionRejected"
  | "ChecksCompleted"
  | "ReleasePublished"
  | "ExperimentStarted"
  | "ExperimentStopped"
  | "ExperimentResultReady";

export interface DomainEventPayload {
  event: DomainEvent;
  timestamp: string;              // ISO 8601
  entityId: string;
  metadata?: Record<string, any>;
}

// Specific event payloads
export interface AssetCreatedPayload extends DomainEventPayload {
  event: "AssetCreated";
  entityId: string;              // Asset.id
  metadata: {
    asset: Asset;
  };
}

export interface RevisionCreatedPayload extends DomainEventPayload {
  event: "RevisionCreated";
  entityId: string;              // Revision.revisionId
  metadata: {
    revision: Revision;
    assetId: string;
  };
}

export interface ChecksCompletedPayload extends DomainEventPayload {
  event: "ChecksCompleted";
  entityId: string;              // Revision.revisionId
  metadata: {
    revisionId: string;
    results: CheckResult[];
    passed: boolean;
  };
}

export interface ExperimentStartedPayload extends DomainEventPayload {
  event: "ExperimentStarted";
  entityId: string;              // Experiment.id
  metadata: {
    experiment: Experiment;
  };
}

// Union type for all event payloads
export type AnyDomainEventPayload =
  | AssetCreatedPayload
  | RevisionCreatedPayload
  | ChecksCompletedPayload
  | ExperimentStartedPayload
  | DomainEventPayload;

