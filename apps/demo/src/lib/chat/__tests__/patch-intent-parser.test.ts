/**
 * Tests for Patch Intent Parser
 */

import { describe, it, expect } from "vitest";
import { parsePatchIntent } from "../patch-intent-parser";
import type { UiPage } from "@fragment_ui/ui-dsl";

// Helper to create test DSL
function createTestDSL(): UiPage {
  return {
    type: "page",
    id: "test-page",
    title: "Test Page",
    children: [
      {
        type: "component",
        id: "button-1",
        component: "Button",
        props: {
          variant: "solid",
          size: "md",
        },
        copy: "Click me",
      },
      {
        type: "section",
        id: "section-1",
        variant: "card",
        title: "Test Section",
        children: [],
      },
    ],
  };
}

describe("Patch Intent Parser", () => {
  describe("parsePatchIntent", () => {
    it("should parse setProp operation", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent("change variant to outline", dsl, "button-1");
      
      expect(result.patches.length).toBeGreaterThan(0);
      expect(result.patches[0].op).toBe("setProp");
      expect(result.patches[0].args.path).toBe("props.variant");
      expect(result.patches[0].args.value).toBe("outline");
    });

    it("should parse setCopy operation", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent('change text to "New Text"', dsl, "button-1");
      
      expect(result.patches.length).toBeGreaterThan(0);
      expect(result.patches[0].op).toBe("setCopy");
      expect(result.patches[0].args.value).toBe("New Text");
    });

    it("should parse removeNode operation", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent("remove the button", dsl, "button-1");
      
      expect(result.patches.length).toBeGreaterThan(0);
      expect(result.patches[0].op).toBe("removeNode");
    });

    it("should parse addNode operation", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent("add a button", dsl);
      
      expect(result.patches.length).toBeGreaterThan(0);
      expect(result.patches[0].op).toBe("addNode");
      expect(result.patches[0].args.node.component).toBe("Button");
    });

    it("should validate patches", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent("change variant to outline", dsl, "button-1");
      
      // Should have diagnostics if validation fails
      expect(result.diagnostics).toBeDefined();
      expect(Array.isArray(result.diagnostics)).toBe(true);
    });

    it("should handle missing target ID", () => {
      const dsl = createTestDSL();
      const result = parsePatchIntent("change variant to outline", dsl);
      
      // Should still attempt to parse, but may have warnings
      expect(result.patches).toBeDefined();
    });
  });
});

