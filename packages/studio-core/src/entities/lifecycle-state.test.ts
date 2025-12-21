import { describe, it, expect } from "vitest";
import {
  LIFECYCLE_STATES,
  isValidTransition,
  type LifecycleState,
} from "./lifecycle-state";

describe("LifecycleState", () => {
  describe("LIFECYCLE_STATES", () => {
    it("should contain all expected states", () => {
      expect(LIFECYCLE_STATES).toContain("draft");
      expect(LIFECYCLE_STATES).toContain("submitted");
      expect(LIFECYCLE_STATES).toContain("approved");
      expect(LIFECYCLE_STATES).toContain("published");
      expect(LIFECYCLE_STATES).toContain("deprecated");
      expect(LIFECYCLE_STATES).toHaveLength(5);
    });
  });

  describe("isValidTransition", () => {
    it("should allow draft → submitted", () => {
      expect(isValidTransition("draft", "submitted")).toBe(true);
    });

    it("should not allow draft → approved", () => {
      expect(isValidTransition("draft", "approved")).toBe(false);
    });

    it("should not allow draft → published", () => {
      expect(isValidTransition("draft", "published")).toBe(false);
    });

    it("should allow submitted → approved", () => {
      expect(isValidTransition("submitted", "approved")).toBe(true);
    });

    it("should allow submitted → draft", () => {
      expect(isValidTransition("submitted", "draft")).toBe(true);
    });

    it("should not allow submitted → published", () => {
      expect(isValidTransition("submitted", "published")).toBe(false);
    });

    it("should allow approved → published", () => {
      expect(isValidTransition("approved", "published")).toBe(true);
    });

    it("should not allow approved → draft", () => {
      expect(isValidTransition("approved", "draft")).toBe(false);
    });

    it("should allow published → deprecated", () => {
      expect(isValidTransition("published", "deprecated")).toBe(true);
    });

    it("should not allow deprecated → any state", () => {
      const states: LifecycleState[] = [
        "draft",
        "submitted",
        "approved",
        "published",
        "deprecated",
      ];
      states.forEach((state) => {
        expect(isValidTransition("deprecated", state)).toBe(false);
      });
    });

    it("should not allow transitions to the same state", () => {
      const states: LifecycleState[] = [
        "draft",
        "submitted",
        "approved",
        "published",
        "deprecated",
      ];
      states.forEach((state) => {
        expect(isValidTransition(state, state)).toBe(false);
      });
    });
  });
});

