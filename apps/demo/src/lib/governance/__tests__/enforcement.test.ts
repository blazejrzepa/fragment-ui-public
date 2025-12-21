/**
 * Tests for Enforcement Points
 */

import { describe, it, expect } from "vitest";
import {
  enforceStudio,
  enforceSubmissions,
  enforceReleases,
} from "../enforcement";
import type { RuleExecutionContext } from "../rule-engine";

describe("Enforcement Points", () => {
  const mockContext: RuleExecutionContext = {
    tsx: `
      import { Button } from "@fragment_ui/ui";
      
      export function TestComponent() {
        return <Button>Click me</Button>;
      }
    `,
    dsl: {
      type: "page",
      id: "test-page",
      sections: [],
    },
    bundleSize: 5000,
    bundleGzipped: 2000,
  };

  it("should enforce at Studio point (soft warnings)", async () => {
    const result = await enforceStudio(mockContext);
    
    expect(result).toBeDefined();
    expect(typeof result.passed).toBe("boolean");
    expect(typeof result.errors).toBe("number");
    expect(typeof result.warnings).toBe("number");
    expect(Array.isArray(result.violations)).toBe(true);
    expect(typeof result.blocksApproval).toBe("boolean");
    
    // Studio should never block approval
    expect(result.blocksApproval).toBe(false);
  });

  it("should enforce at Submissions point (hard gates)", async () => {
    const result = await enforceSubmissions(mockContext);
    
    expect(result).toBeDefined();
    expect(typeof result.passed).toBe("boolean");
    expect(typeof result.errors).toBe("number");
    expect(typeof result.warnings).toBe("number");
    expect(Array.isArray(result.violations)).toBe(true);
    expect(typeof result.blocksApproval).toBe("boolean");
    
    // Submissions should block on errors
    if (result.errors > 0) {
      expect(result.blocksApproval).toBe(true);
    }
  });

  it("should enforce at Releases point (final gates)", async () => {
    const result = await enforceReleases(mockContext);
    
    expect(result).toBeDefined();
    expect(typeof result.passed).toBe("boolean");
    expect(typeof result.errors).toBe("number");
    expect(typeof result.warnings).toBe("number");
    expect(Array.isArray(result.violations)).toBe(true);
    expect(typeof result.blocksApproval).toBe("boolean");
    
    // Releases should block on errors
    if (result.errors > 0) {
      expect(result.blocksApproval).toBe(true);
    }
  });

  it("should use custom policy bundles", async () => {
    const result = await enforceSubmissions(mockContext, ["marketing"]);
    
    expect(result).toBeDefined();
    // Should have different rules than default bundles
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it("should return correct violation counts", async () => {
    const result = await enforceStudio(mockContext);
    
    const errorCount = result.violations.filter((v) => v.severity === "error").length;
    const warningCount = result.violations.filter((v) => v.severity === "warning").length;
    
    expect(result.errors).toBe(errorCount);
    expect(result.warnings).toBe(warningCount);
  });
});

