/**
 * Chat Session Manager
 * 
 * Manages chat session state including:
 * - Current Asset/Revision tracking
 * - Patch history
 * - Conversation context
 */

import type { Patch } from "@fragment_ui/ui-dsl";

export interface ChatSession {
  sessionId: string;
  currentAssetId?: string;
  currentRevisionId?: string;
  currentDSL?: any; // UiPage
  currentCode?: string;
  patchHistory: PatchHistoryEntry[];
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    intent?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PatchHistoryEntry {
  id: string;
  timestamp: string;
  operation: Patch;
  targetId?: string;
  description: string;
  dslBefore?: any;
  dslAfter?: any;
}

/**
 * In-memory session store (for MVP - replace with DB in production)
 */
const sessions = new Map<string, ChatSession>();

/**
 * Create or get chat session
 */
export function getOrCreateSession(sessionId: string): ChatSession {
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    session.updatedAt = new Date().toISOString();
    return session;
  }
  
  const newSession: ChatSession = {
    sessionId,
    patchHistory: [],
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  sessions.set(sessionId, newSession);
  return newSession;
}

/**
 * Update session with current Asset/Revision
 */
export function updateSessionAsset(
  sessionId: string,
  assetId: string,
  revisionId: string,
  dsl?: any,
  code?: string
): ChatSession {
  const session = getOrCreateSession(sessionId);
  session.currentAssetId = assetId;
  session.currentRevisionId = revisionId;
  if (dsl) session.currentDSL = dsl;
  if (code) session.currentCode = code;
  session.updatedAt = new Date().toISOString();
  sessions.set(sessionId, session);
  return session;
}

/**
 * Add patch to history
 */
export function addPatchToHistory(
  sessionId: string,
  operation: Patch,
  description: string,
  targetId?: string,
  dslBefore?: any,
  dslAfter?: any
): PatchHistoryEntry {
  const session = getOrCreateSession(sessionId);
  
  const entry: PatchHistoryEntry = {
    id: `patch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    operation,
    targetId,
    description,
    dslBefore,
    dslAfter,
  };
  
  session.patchHistory.push(entry);
  session.updatedAt = new Date().toISOString();
  sessions.set(sessionId, session);
  
  return entry;
}

/**
 * Add message to conversation history
 */
export function addMessageToHistory(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  intent?: string
): void {
  const session = getOrCreateSession(sessionId);
  session.conversationHistory.push({
    role,
    content,
    timestamp: new Date().toISOString(),
    intent,
  });
  session.updatedAt = new Date().toISOString();
  sessions.set(sessionId, session);
}

/**
 * Get session
 */
export function getSession(sessionId: string): ChatSession | null {
  return sessions.get(sessionId) || null;
}

/**
 * Clear session
 */
export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

/**
 * Get patch history for session
 */
export function getPatchHistory(sessionId: string): PatchHistoryEntry[] {
  const session = getSession(sessionId);
  return session?.patchHistory || [];
}

/**
 * Get recent patches (last N)
 */
export function getRecentPatches(sessionId: string, limit: number = 10): PatchHistoryEntry[] {
  const history = getPatchHistory(sessionId);
  return history.slice(-limit);
}

