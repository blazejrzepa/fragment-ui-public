/**
 * UI-DSL v2 Validator Tests
 * 
 * Unit tests for UI-DSL v2 validation
 */

import { describe, it, expect } from "vitest";
import { validateNode, validatePage, validatePatch, type ComponentRegistry } from "./validator";
import type { UiPage, UiComponent, UiSection, Patch } from "./types-v2";

// Helper to generate UUID v4
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const mockRegistry: ComponentRegistry = {
  components: {
    Button: {
      import: "@fragment_ui/ui/button",
      variants: ["solid", "outline", "ghost"],
      props: {
        variant: "string",
        size: "string",
        disabled: "boolean",
      },
    },
    Input: {
      import: "@fragment_ui/ui/input",
      props: {
        value: "string",
        placeholder: "string",
        type: "string",
      },
    },
    Card: {
      import: "@fragment_ui/ui/card",
      slots: ["header", "content", "footer"],
      props: {
        variant: "string",
      },
    },
  },
};

describe("validateNode", () => {
  it("should validate a valid component node", () => {
    const node: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Button",
      variant: "solid",
      props: {
        size: "md",
      },
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toHaveLength(0);
  });

  it("should reject invalid UUID", () => {
    const node = {
      type: "component",
      id: "not-a-uuid",
      component: "Button",
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "SCHEMA_VALIDATION_ERROR")).toBe(true);
  });

  it("should reject component not in registry", () => {
    const node: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "NonExistentComponent",
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "INVALID_COMPONENT")).toBe(true);
  });

  it("should reject invalid variant", () => {
    const node: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Button",
      variant: "invalid-variant",
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "INVALID_VARIANT")).toBe(true);
  });

  it("should warn about unknown props", () => {
    const node: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Button",
      props: {
        unknownProp: "value",
      },
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(true); // Warnings don't make it invalid
    expect(result.diagnostics.some((d) => d.code === "UNKNOWN_PROP" && d.level === "warning")).toBe(true);
  });

  it("should reject invalid slot", () => {
    const node: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Card",
      slots: {
        invalidSlot: [],
      },
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "INVALID_SLOT")).toBe(true);
  });

  it("should validate nested children", () => {
    const node: UiSection = {
      type: "section",
      id: randomUUID(),
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "Button",
        },
        {
          type: "component",
          id: randomUUID(),
          component: "NonExistentComponent", // Invalid child
        },
      ],
    };

    const result = validateNode(node, mockRegistry);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "INVALID_COMPONENT")).toBe(true);
  });
});

describe("validatePage", () => {
  it("should validate a valid page", () => {
    const page: UiPage = {
      type: "page",
      id: randomUUID(),
      title: "Test Page",
      children: [
        {
          type: "section",
          id: randomUUID(),
          children: [
            {
              type: "component",
              id: randomUUID(),
              component: "Button",
            },
          ],
        },
      ],
    };

    const result = validatePage(page, mockRegistry);
    expect(result.valid).toBe(true);
  });

  it("should reject page with invalid child", () => {
    const page: UiPage = {
      type: "page",
      id: randomUUID(),
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "NonExistentComponent",
        },
      ],
    };

    const result = validatePage(page, mockRegistry);
    expect(result.valid).toBe(false);
  });
});

describe("validatePatch", () => {
  it("should validate a valid patch", () => {
    const patch: Patch = {
      targetId: randomUUID(),
      op: "setProp",
      args: {
        path: "props.variant",
        value: "outline",
      },
    };

    const result = validatePatch(patch);
    expect(result.valid).toBe(true);
  });

  it("should reject patch with invalid UUID", () => {
    const patch = {
      targetId: "not-a-uuid",
      op: "setProp",
      args: {},
    };

    const result = validatePatch(patch);
    expect(result.valid).toBe(false);
  });

  it("should reject patch with invalid operation", () => {
    const patch = {
      targetId: randomUUID(),
      op: "invalidOp",
      args: {},
    };

    const result = validatePatch(patch);
    expect(result.valid).toBe(false);
  });
});

