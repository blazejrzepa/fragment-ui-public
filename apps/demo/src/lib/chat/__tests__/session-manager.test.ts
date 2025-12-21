/**
 * Tests for Session Manager
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  getOrCreateSession,
  updateSessionAsset,
  addPatchToHistory,
  addMessageToHistory,
  getSession,
  clearSession,
  getPatchHistory,
} from "../session-manager";
import type { PatchOperation } from "@fragment_ui/ui-dsl";

describe("Session Manager", () => {
  beforeEach(() => {
    // Clear all sessions before each test
    clearSession("test-session");
  });

  describe("getOrCreateSession", () => {
    it("should create new session", () => {
      const session = getOrCreateSession("test-session");
      expect(session.sessionId).toBe("test-session");
      expect(session.patchHistory).toEqual([]);
      expect(session.conversationHistory).toEqual([]);
    });

    it("should return existing session", () => {
      const session1 = getOrCreateSession("test-session");
      session1.currentAssetId = "asset-1";
      
      const session2 = getOrCreateSession("test-session");
      expect(session2.currentAssetId).toBe("asset-1");
    });
  });

  describe("updateSessionAsset", () => {
    it("should update session with asset info", () => {
      const session = updateSessionAsset(
        "test-session",
        "asset-1",
        "revision-1",
        { type: "page", id: "page-1", children: [] },
        "export function Test() { return <div>Test</div>; }"
      );
      
      expect(session.currentAssetId).toBe("asset-1");
      expect(session.currentRevisionId).toBe("revision-1");
      expect(session.currentDSL).toBeDefined();
      expect(session.currentCode).toBeDefined();
    });
  });

  describe("addPatchToHistory", () => {
    it("should add patch to history", () => {
      const entry = addPatchToHistory(
        "test-session",
        "setProp" as PatchOperation,
        "Changed button variant",
        "button-1"
      );
      
      expect(entry.operation).toBe("setProp");
      expect(entry.targetId).toBe("button-1");
      expect(entry.description).toBe("Changed button variant");
      
      const history = getPatchHistory("test-session");
      expect(history.length).toBe(1);
      expect(history[0].id).toBe(entry.id);
    });
  });

  describe("addMessageToHistory", () => {
    it("should add message to conversation history", () => {
      addMessageToHistory("test-session", "user", "create a dashboard", "generate");
      addMessageToHistory("test-session", "assistant", "Generated dashboard");
      
      const session = getSession("test-session");
      expect(session?.conversationHistory.length).toBe(2);
      expect(session?.conversationHistory[0].role).toBe("user");
      expect(session?.conversationHistory[1].role).toBe("assistant");
    });
  });
});

