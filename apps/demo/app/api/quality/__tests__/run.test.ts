/**
 * Unit tests for Quality Run API
 */

import { describe, it, expect } from "vitest";
import {
  checkA11y,
  checkBundleSize,
  lintDS,
  runE2ESmoke,
  checkVisual,
  runQualityChecks,
} from "@/lib/quality-checks";

describe("quality-checks", () => {
  const testCode = `
import { Button, Card } from "@fragment_ui/ui";
import * as React from "react";

export function TestComponent() {
  return (
    <Card>
      <Button variant="solid">Click me</Button>
    </Card>
  );
}
`;

  const testHtml = `
<div>
  <button>Click me</button>
</div>
`;

  describe("checkA11y", () => {
    it("should return A11y result", async () => {
      const result = await checkA11y(testHtml);
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("violations");
      expect(result).toHaveProperty("passes");
      expect(result).toHaveProperty("incomplete");
    });

    it("should handle invalid HTML gracefully", async () => {
      const result = await checkA11y("");
      expect(result).toHaveProperty("passed");
    });
  });

  describe("checkBundleSize", () => {
    it("should calculate bundle size", async () => {
      const result = await checkBundleSize(testCode);
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("size");
      expect(result).toHaveProperty("gzipped");
      expect(result).toHaveProperty("limit");
      expect(result.size).toBeGreaterThan(0);
    });

    it("should parse component imports", async () => {
      const result = await checkBundleSize(testCode);
      expect(result.components).toBeInstanceOf(Array);
    });

    it("should fail if size exceeds limit", async () => {
      const largeCode = "x".repeat(200 * 1024); // 200KB
      const result = await checkBundleSize(largeCode);
      expect(result.passed).toBe(false);
    });
  });

  describe("lintDS", () => {
    it("should detect raw HTML elements", async () => {
      const codeWithRawHtml = `
export function Test() {
  return <div><button>Click</button></div>;
}
`;
      const result = await lintDS(codeWithRawHtml);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.rule === "noRawHtml")).toBe(true);
    });

    it("should detect hardcoded colors", async () => {
      const codeWithColor = `
export function Test() {
  return <div style={{ color: "#ff0000" }}>Test</div>;
}
`;
      const result = await lintDS(codeWithColor);
      expect(result.errors.some((e) => e.rule === "noHardcodedColors")).toBe(true);
    });

    it("should detect invalid imports", async () => {
      const codeWithInvalidImport = `
import { Button } from "some-other-library";
export function Test() {
  return <Button>Click</Button>;
}
`;
      const result = await lintDS(codeWithInvalidImport);
      expect(result.errors.some((e) => e.rule === "importOnly")).toBe(true);
    });

    it("should pass for valid code", async () => {
      const result = await lintDS(testCode);
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("runE2ESmoke", () => {
    it("should return E2E result", async () => {
      const result = await runE2ESmoke(testCode);
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("tests");
      expect(result.tests).toBeInstanceOf(Array);
    });

    it("should check if component renders", async () => {
      const result = await runE2ESmoke(testCode);
      expect(result.tests.some((t) => t.name === "Component renders")).toBe(true);
    });
  });

  describe("checkVisual", () => {
    it("should return visual result", async () => {
      const result = await checkVisual(testCode);
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("changed");
      expect(result).toHaveProperty("added");
      expect(result).toHaveProperty("removed");
      expect(result).toHaveProperty("snapshots");
    });
  });

  describe("runQualityChecks", () => {
    it("should run all quality checks", async () => {
      const result = await runQualityChecks(testCode, testHtml);
      expect(result).toHaveProperty("a11y");
      expect(result).toHaveProperty("bundleSize");
      expect(result).toHaveProperty("lintDS");
      expect(result).toHaveProperty("e2e");
      expect(result).toHaveProperty("visual");
    });

    it("should handle missing HTML gracefully", async () => {
      const result = await runQualityChecks(testCode);
      expect(result.a11y).toBeUndefined();
      expect(result.bundleSize).toBeDefined();
    });
  });
});

