/**
 * Unit tests for DSL Patch Operations
 */

import { describe, it, expect } from "vitest";
import { applyPatch, generateInversePatch, findNodeById } from "@/lib/dsl-patch";
import type { UiPage, Patch, UiComponent } from "@fragment_ui/ui-dsl";

describe("dsl-patch", () => {
  const createTestPage = (): UiPage => ({
    type: "page",
    id: "page-1",
    title: "Test Page",
    description: "Test",
    children: [
      {
        type: "component",
        id: "button-1",
        component: "Button",
        props: { variant: "solid", size: "md" },
        copy: "Click me",
      } as UiComponent,
      {
        type: "section",
        id: "section-1",
        children: [
          {
            type: "component",
            id: "input-1",
            component: "Input",
            props: { placeholder: "Enter text" },
          } as UiComponent,
        ],
      },
    ],
    dataSources: [],
  });

  describe("applyPatch", () => {
    it("should apply setProp patch", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "setProp",
        args: { path: "props.variant", value: "outline" },
      };

      const result = applyPatch(dsl, patch);
      expect(result.diagnostics).toHaveLength(0);
      
      const button = findNodeById(result.dsl, "button-1") as UiComponent;
      expect(button.props?.variant).toBe("outline");
    });

    it("should apply setCopy patch", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "setCopy",
        args: { copy: "New text" },
      };

      const result = applyPatch(dsl, patch);
      expect(result.diagnostics).toHaveLength(0);
      
      const button = findNodeById(result.dsl, "button-1") as UiComponent;
      expect(button.copy).toBe("New text");
    });

    it("should apply toggleVariant patch", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "toggleVariant",
        args: { variant: "ghost" },
      };

      const result = applyPatch(dsl, patch, {
        components: {
          Button: {
            variants: ["solid", "outline", "ghost"],
            props: {},
          },
        },
      });
      expect(result.diagnostics).toHaveLength(0);
      
      const button = findNodeById(result.dsl, "button-1") as UiComponent;
      expect(button.variant).toBe("ghost");
    });

    it("should apply addNode patch", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "section-1",
        op: "addNode",
        args: {
          node: {
            type: "component",
            id: "new-button",
            component: "Button",
            props: {},
          },
          position: "after",
        },
      };

      const result = applyPatch(dsl, patch);
      expect(result.diagnostics).toHaveLength(0);
      
      const section = findNodeById(result.dsl, "section-1");
      expect("children" in section && section.children).toHaveLength(2);
    });

    it("should apply removeNode patch", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "input-1",
        op: "removeNode",
        args: {},
      };

      const result = applyPatch(dsl, patch);
      expect(result.diagnostics).toHaveLength(0);
      
      const removed = findNodeById(result.dsl, "input-1");
      expect(removed).toBeNull();
    });

    it("should return error for invalid targetId", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "non-existent",
        op: "setProp",
        args: { path: "props.variant", value: "outline" },
      };

      const result = applyPatch(dsl, patch);
      expect(result.diagnostics.length).toBeGreaterThan(0);
      expect(result.diagnostics[0].level).toBe("error");
      expect(result.diagnostics[0].code).toBe("NODE_NOT_FOUND");
    });

    it("should validate variant against registry", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "toggleVariant",
        args: { variant: "invalid-variant" },
      };

      const result = applyPatch(dsl, patch, {
        components: {
          Button: {
            variants: ["solid", "outline"],
            props: {},
          },
        },
      });

      expect(result.diagnostics.length).toBeGreaterThan(0);
      expect(result.diagnostics[0].level).toBe("error");
      expect(result.diagnostics[0].code).toBe("INVALID_VARIANT");
    });
  });

  describe("generateInversePatch", () => {
    it("should generate inverse for setProp", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "setProp",
        args: { path: "props.variant", value: "outline" },
      };

      const inverse = generateInversePatch(dsl, patch);
      expect(inverse).not.toBeNull();
      expect(inverse?.op).toBe("setProp");
      expect(inverse?.args.value).toBe("solid"); // Original value
    });

    it("should generate inverse for setCopy", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "setCopy",
        args: { copy: "New text" },
      };

      const inverse = generateInversePatch(dsl, patch);
      expect(inverse).not.toBeNull();
      expect(inverse?.op).toBe("setCopy");
      expect(inverse?.args.copy).toBe("Click me"); // Original copy
    });

    it("should generate inverse for reorder", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "button-1",
        op: "reorder",
        args: { direction: "up" },
      };

      const inverse = generateInversePatch(dsl, patch);
      expect(inverse).not.toBeNull();
      expect(inverse?.op).toBe("reorder");
      expect(inverse?.args.direction).toBe("down"); // Reverse direction
    });

    it("should generate inverse for addNode", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "section-1",
        op: "addNode",
        args: {
          node: {
            type: "component",
            id: "new-button",
            component: "Button",
            props: {},
          },
          position: "after",
        },
      };

      const inverse = generateInversePatch(dsl, patch);
      expect(inverse).not.toBeNull();
      expect(inverse?.op).toBe("removeNode");
      expect(inverse?.targetId).toBe("new-button");
    });

    it("should return null for operations without simple inverse", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        targetId: "input-1",
        op: "removeNode",
        args: {},
      };

      const inverse = generateInversePatch(dsl, patch);
      expect(inverse).toBeNull(); // removeNode cannot be easily inverted
    });
  });

  describe("findNodeById", () => {
    it("should find node by id", () => {
      const dsl = createTestPage();
      const node = findNodeById(dsl, "button-1");
      expect(node).not.toBeNull();
      expect((node as UiComponent).component).toBe("Button");
    });

    it("should find nested node", () => {
      const dsl = createTestPage();
      const node = findNodeById(dsl, "input-1");
      expect(node).not.toBeNull();
      expect((node as UiComponent).component).toBe("Input");
    });

    it("should return null for non-existent node", () => {
      const dsl = createTestPage();
      const node = findNodeById(dsl, "non-existent");
      expect(node).toBeNull();
    });
  });
});

