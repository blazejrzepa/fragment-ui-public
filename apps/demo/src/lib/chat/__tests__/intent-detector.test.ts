/**
 * Tests for Intent Detector
 */

import { describe, it, expect } from "vitest";
import { detectChatIntent, isQuestion } from "../intent-detector";

describe("Intent Detector", () => {
  describe("detectChatIntent", () => {
    it("should detect generate intent", () => {
      const result = detectChatIntent("create a dashboard", { hasExistingDSL: false });
      expect(result.intent).toBe("generate");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it("should detect edit intent when DSL exists", () => {
      const result = detectChatIntent("change the button color", { hasExistingDSL: true });
      expect(result.intent).toBe("edit");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it("should detect patch intent", () => {
      const result = detectChatIntent("remove the button", { hasExistingDSL: true });
      expect(result.intent).toBe("patch");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it("should extract target ID from message", () => {
      const result = detectChatIntent("change button-1 color to red");
      expect(result.targetId).toBeDefined();
    });

    it("should detect patch operations", () => {
      const result = detectChatIntent("remove the button");
      expect(result.patchOperations).toContain("removeNode");
    });
  });

  describe("isQuestion", () => {
    it("should detect questions", () => {
      expect(isQuestion("what is this?")).toBe(true);
      expect(isQuestion("how does it work?")).toBe(true);
      expect(isQuestion("co to jest?")).toBe(true);
    });

    it("should not detect commands as questions", () => {
      expect(isQuestion("create a dashboard")).toBe(false);
      expect(isQuestion("change the color")).toBe(false);
    });
  });
});

