/**
 * Tests for UI-DSL Parser
 */

import { describe, it, expect } from "vitest";
import { parsePrompt } from "../parser";

describe("UI-DSL Parser", () => {
  describe("parsePrompt", () => {
    it("should parse form prompt", () => {
      const result = parsePrompt("Create a registration form with email and password");
      
      expect(result.dsl.type).toBe("form");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should parse table prompt", () => {
      const result = parsePrompt("Create a table with columns: name, email, role");
      
      expect(result.dsl.type).toBe("table");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should parse dashboard prompt", () => {
      const result = parsePrompt("Create a dashboard with metrics and charts");
      
      expect(result.dsl.type).toBe("dashboard");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should parse page prompt", () => {
      const result = parsePrompt("Create a settings page with tabs");
      
      expect(result.dsl.type).toBe("page");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should default to form for unclear prompts", () => {
      const result = parsePrompt("Create something");
      
      expect(result.dsl.type).toBe("form");
    });
  });
});

