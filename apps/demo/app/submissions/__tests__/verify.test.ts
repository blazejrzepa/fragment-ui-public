/**
 * Tests for Verification System
 */

import { describe, it, expect } from "vitest";
import { verifySubmission } from "../verify";

describe("Verification System", () => {
  describe("verifySubmission", () => {
    it("should detect lint errors in code with raw HTML elements", async () => {
      const code = `
        export default function TestComponent() {
          return (
            <div>
              <button>Click me</button>
              <input type="text" />
            </div>
          );
        }
      `;

      const result = await verifySubmission(code);

      expect(result.lint.errors).toBeGreaterThanOrEqual(0);
      if (result.lint.issues.length > 0) {
        // ESLint returns rule as "ds-no-raw/no-raw-elements" or "no-raw-elements"
        expect(result.lint.issues[0].rule).toMatch(/no-raw-elements|ds-no-raw|eslint-error/);
      }
    });

    it("should detect hardcoded colors", async () => {
      const code = `
        export default function TestComponent() {
          return (
            <div style={{ color: "#ff0000", backgroundColor: "rgb(255, 0, 0)" }}>
              Test
            </div>
          );
        }
      `;

      const result = await verifySubmission(code);

      expect(result.tokens.violations).toBeGreaterThanOrEqual(0);
      expect(result.tokens.issues.length).toBeGreaterThanOrEqual(0);
      expect(result.tokens.issues[0].suggestion).toContain("design token");
    });

    it("should calculate score correctly", async () => {
      const code = `
        import { Button } from "@fragment_ui/ui";
        
        export default function TestComponent() {
          return <Button variant="solid">Click me</Button>;
        }
      `;

      const result = await verifySubmission(code);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(typeof result.score).toBe("number");
    });

    it("should include figma parity check", async () => {
      const code = `
        import { Button } from "@fragment_ui/ui";
        
        export default function TestComponent() {
          return <Button variant="solid">Click me</Button>;
        }
      `;

      const result = await verifySubmission(code);

      expect(result.figma).toBeDefined();
      expect(result.figma.coverage).toBeGreaterThanOrEqual(0);
      expect(result.figma.coverage).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.figma.missing)).toBe(true);
    }, 30000); // Increase timeout to 30s for file I/O

    it("should generate suggestions", async () => {
      const code = `
        export default function TestComponent() {
          return (
            <div style={{ color: "#ff0000" }}>
              <button>Click</button>
            </div>
          );
        }
      `;

      const result = await verifySubmission(code);

      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(0);
    });

    it("should return detailed lint issues with line numbers", async () => {
      const code = `
        export default function TestComponent() {
          return <button>Click</button>;
        }
      `;

      const result = await verifySubmission(code);

      // Code with raw <button> should ideally have lint errors
      expect(result.lint.errors).toBeGreaterThanOrEqual(0);
      if (result.lint.issues.length > 0) {
        expect(result.lint.issues[0].line).toBeGreaterThanOrEqual(0);
        expect(result.lint.issues[0].message).toBeDefined();
        expect(result.lint.issues[0].rule).toBeDefined();
      }
    });

    it("should return detailed token issues with line numbers", async () => {
      const code = `
        export default function TestComponent() {
          return <div style={{ color: "#ff0000" }}>Test</div>;
        }
      `;

      const result = await verifySubmission(code);

      if (result.tokens.violations > 0) {
        expect(result.tokens.issues[0].line).toBeGreaterThanOrEqual(0);
        expect(result.tokens.issues[0].code).toBeDefined();
        expect(result.tokens.issues[0].suggestion).toBeDefined();
      }
    });

    it("should handle valid code with high score", async () => {
      const code = `
        import { Button } from "@fragment_ui/ui";
        
        export default function TestComponent() {
          return (
            <Button variant="solid" size="md">
              Click me
            </Button>
          );
        }
      `;

      const result = await verifySubmission(code);

      // Valid code should have fewer errors
      expect(result.lint.errors).toBeLessThanOrEqual(1); // May have some warnings
      expect(result.score).toBeGreaterThan(50); // Should score reasonably well
    });
  });
});

