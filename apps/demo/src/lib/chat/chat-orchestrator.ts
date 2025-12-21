/**
 * Chat Orchestrator
 * 
 * Coordinates chat sessions with revision tracking and patch history.
 * Provides high-level interface for managing chat context, Asset/Revision state,
 * and patch operations in a conversational editing workflow.
 */

import {
  getOrCreateSession,
  updateSessionAsset,
  addPatchToHistory,
  addMessageToHistory,
  getSession,
  getPatchHistory,
  type ChatSession,
  type PatchHistoryEntry,
} from "./session-manager";
import { detectChatIntent, type IntentDetectionResult } from "./intent-detector";
import { parsePatchIntent, type ParsedPatch } from "./patch-intent-parser";
import type { UiPage, Patch } from "@fragment_ui/ui-dsl";

export interface ChatContext {
  sessionId: string;
  assetId?: string;
  revisionId?: string;
  currentDSL?: UiPage;
  currentCode?: string;
}

export interface ChatOrchestratorOptions {
  sessionId?: string;
  context?: ChatContext;
  registry?: any;
}

export interface OrchestratedResponse {
  sessionId: string;
  intent: IntentDetectionResult;
  patches?: ParsedPatch;
  revisionId?: string;
  context: ChatContext;
  message: string;
}

/**
 * Chat Orchestrator - coordinates chat interactions with revision tracking
 */
export class ChatOrchestrator {
  private sessionId: string;
  private context: ChatContext;

  constructor(options: ChatOrchestratorOptions = {}) {
    this.sessionId = options.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize context from options or get from session
    if (options.context) {
      this.context = options.context;
      // Sync with session
      if (this.context.assetId && this.context.revisionId) {
        updateSessionAsset(
          this.sessionId,
          this.context.assetId,
          this.context.revisionId,
          this.context.currentDSL,
          this.context.currentCode
        );
      }
    } else {
      // Load from existing session
      const session = getOrCreateSession(this.sessionId);
      this.context = {
        sessionId: this.sessionId,
        assetId: session.currentAssetId,
        revisionId: session.currentRevisionId,
        currentDSL: session.currentDSL,
        currentCode: session.currentCode,
      };
    }
  }

  /**
   * Process a user message and return orchestrated response
   */
  async processMessage(
    message: string,
    options: {
      registry?: any;
      dsl?: UiPage;
      code?: string;
    } = {}
  ): Promise<OrchestratedResponse> {
    // Update context with provided DSL/code if available
    if (options.dsl) {
      this.context.currentDSL = options.dsl;
    }
    if (options.code) {
      this.context.currentCode = options.code;
    }

    // Detect intent
    const intent = detectChatIntent(message, {
      currentAssetId: this.context.assetId,
      currentRevisionId: this.context.revisionId,
      hasExistingDSL: !!this.context.currentDSL || !!options.dsl,
    });

    // Add message to history
    addMessageToHistory(this.sessionId, "user", message, intent.intent);

    // If edit intent and DSL available, parse patch intent
    let patches: ParsedPatch | undefined;
    if (intent.intent === "edit" && this.context.currentDSL) {
      patches = parsePatchIntent(message, this.context.currentDSL);
      
      // Add patches to history
      if (patches.patches.length > 0) {
        patches.patches.forEach((patch) => {
          addPatchToHistory(
            this.sessionId,
            patch,
            `Patch: ${patch.op}`,
            patch.targetId as string
          );
        });
      }
    }

    return {
      sessionId: this.sessionId,
      intent,
      patches,
      context: { ...this.context },
      message,
    };
  }

  /**
   * Update context after patch application
   */
  updateAfterPatch(
    patchedDSL: UiPage,
    newCode: string,
    revisionId?: string
  ): void {
    this.context.currentDSL = patchedDSL;
    this.context.currentCode = newCode;
    
    if (revisionId) {
      this.context.revisionId = revisionId;
    }

    // Update session
    if (this.context.assetId && this.context.revisionId) {
      updateSessionAsset(
        this.sessionId,
        this.context.assetId,
        this.context.revisionId,
        patchedDSL,
        newCode
      );
    }
  }

  /**
   * Update Asset/Revision context
   */
  setAssetRevision(assetId: string, revisionId: string, dsl?: UiPage, code?: string): void {
    this.context.assetId = assetId;
    this.context.revisionId = revisionId;
    if (dsl) this.context.currentDSL = dsl;
    if (code) this.context.currentCode = code;

    updateSessionAsset(
      this.sessionId,
      assetId,
      revisionId,
      dsl || this.context.currentDSL,
      code || this.context.currentCode
    );
  }

  /**
   * Get current context
   */
  getContext(): ChatContext {
    return { ...this.context };
  }

  /**
   * Get patch history
   */
  getPatchHistory(limit?: number): PatchHistoryEntry[] {
    if (limit) {
      return getPatchHistory(this.sessionId).slice(-limit);
    }
    return getPatchHistory(this.sessionId);
  }

  /**
   * Get session
   */
  getSession(): ChatSession | null {
    return getSession(this.sessionId);
  }
}

/**
 * Create a new chat orchestrator instance
 */
export function createChatOrchestrator(options: ChatOrchestratorOptions = {}): ChatOrchestrator {
  return new ChatOrchestrator(options);
}

