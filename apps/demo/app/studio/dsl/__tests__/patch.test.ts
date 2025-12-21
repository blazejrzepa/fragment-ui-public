/**
 * Tests for UI-DSL Patch Operations
 */

import { describe, it, expect } from "vitest";
import { applyPatch, findNode } from "../patch";
import type { Patch, NodeRef } from "../patch";
import type { UiForm, UiPage } from "../types";
import { generateId } from "../types";

function createTestForm(): UiForm {
  return {
    id: generateId(),
    type: "form",
    title: "Test Form",
    fields: [
      {
        id: "field-1",
        name: "email",
        label: "Email",
        component: "Input",
      },
      {
        id: "field-2",
        name: "password",
        label: "Password",
        component: "PasswordInput",
      },
    ],
    actions: [
      {
        id: "action-1",
        type: "submit",
        label: "Submit",
        variant: "primary",
      },
    ],
  };
}

function createTestPage(): UiPage {
  return {
    id: generateId(),
    type: "page",
    title: "Test Page",
    sections: [
      {
        id: "section-1",
        kind: "card",
        title: "Section 1",
        content: [],
      },
      {
        id: "section-2",
        kind: "card",
        title: "Section 2",
        content: [],
      },
      {
        id: "section-3",
        kind: "card",
        title: "Section 3",
        content: [],
      },
    ],
  };
}

describe("Patch Operations", () => {
  describe("duplicateNode", () => {
    it("should duplicate a form field", () => {
      const dsl = createTestForm();
      const patch: Patch = {
        op: "duplicateNode",
        target: { type: "byId", id: "field-1" },
      };

      const result = applyPatch(dsl, patch);

      expect(result.fields).toHaveLength(3);
      expect(result.fields[0].id).toBe("field-1");
      expect(result.fields[1].id).not.toBe("field-1"); // Duplicate has new ID
      expect(result.fields[1].name).toBe("email"); // Same properties
      expect(result.fields[2].id).toBe("field-2"); // Original second field
    });

    it("should duplicate a page section", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        op: "duplicateNode",
        target: { type: "byId", id: "section-1" },
      };

      const result = applyPatch(dsl, patch);

      expect(result.sections).toHaveLength(4);
      expect(result.sections[0].id).toBe("section-1");
      expect(result.sections[1].id).not.toBe("section-1"); // Duplicate has new ID
      expect(result.sections[1].title).toBe("Section 1"); // Same properties
    });

    it("should throw error if node not found", () => {
      const dsl = createTestForm();
      const patch: Patch = {
        op: "duplicateNode",
        target: { type: "byId", id: "non-existent" },
      };

      expect(() => applyPatch(dsl, patch)).toThrow("Node not found");
    });
  });

  describe("swap", () => {
    it("should swap two form fields", () => {
      const dsl = createTestForm();
      const patch: Patch = {
        op: "swap",
        a: { type: "byId", id: "field-1" },
        b: { type: "byId", id: "field-2" },
      };

      const result = applyPatch(dsl, patch);

      expect(result.fields[0].id).toBe("field-2");
      expect(result.fields[1].id).toBe("field-1");
    });

    it("should swap two page sections", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        op: "swap",
        a: { type: "byId", id: "section-1" },
        b: { type: "byId", id: "section-3" },
      };

      const result = applyPatch(dsl, patch);

      expect(result.sections[0].id).toBe("section-3");
      expect(result.sections[2].id).toBe("section-1");
    });

    it("should throw error if nodes are in different parents", () => {
      const dsl = createTestForm();
      const patch: Patch = {
        op: "swap",
        a: { type: "byId", id: "field-1" },
        b: { type: "byId", id: "action-1" },
      };

      expect(() => applyPatch(dsl, patch)).toThrow("Cannot swap nodes from different parents");
    });
  });

  describe("bindData", () => {
    it("should bind data source to a section", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        op: "bindData",
        target: { type: "byId", id: "section-1" },
        data: {
          kind: "http",
          url: "https://api.example.com/data",
          method: "GET",
        },
      };

      const result = applyPatch(dsl, patch);
      const section = findNode(result, { type: "byId", id: "section-1" });

      expect(section?.data).toBeDefined();
      expect(section?.data?.kind).toBe("http");
      expect(section?.data?.url).toBe("https://api.example.com/data");
    });

    it("should bind static data to a section", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        op: "bindData",
        target: { type: "byId", id: "section-2" },
        data: {
          kind: "static",
          data: { items: [1, 2, 3] },
        },
      };

      const result = applyPatch(dsl, patch);
      const section = findNode(result, { type: "byId", id: "section-2" });

      expect(section?.data).toBeDefined();
      expect(section?.data?.kind).toBe("static");
      expect(section?.data?.data).toEqual({ items: [1, 2, 3] });
    });
  });

  describe("renameSection", () => {
    it("should rename a section title", () => {
      const dsl = createTestPage();
      const patch: Patch = {
        op: "renameSection",
        target: { type: "byId", id: "section-1" },
        value: "New Section Title",
      };

      const result = applyPatch(dsl, patch);
      const section = findNode(result, { type: "byId", id: "section-1" });

      expect(section?.title).toBe("New Section Title");
    });

    it("should create title if it doesn't exist", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        sections: [
          {
            id: "section-no-title",
            kind: "card",
            content: [],
          },
        ],
      };

      const patch: Patch = {
        op: "renameSection",
        target: { type: "byId", id: "section-no-title" },
        value: "New Title",
      };

      const result = applyPatch(dsl, patch);
      const section = findNode(result, { type: "byId", id: "section-no-title" });

      expect(section?.title).toBe("New Title");
    });

    it("should fallback to label if title doesn't exist", () => {
      const dsl: UiForm = {
        id: generateId(),
        type: "form",
        fields: [
          {
            id: "field-with-label",
            name: "test",
            label: "Old Label",
            component: "Input",
          },
        ],
      };

      const patch: Patch = {
        op: "renameSection",
        target: { type: "byId", id: "field-with-label" },
        value: "New Label",
      };

      const result = applyPatch(dsl, patch);
      const field = findNode(result, { type: "byId", id: "field-with-label" });

      expect(field?.label).toBe("New Label");
    });
  });

  describe("immutability", () => {
    it("should not mutate original DSL when applying patch", () => {
      const original = createTestForm();
      const originalFieldsLength = original.fields.length;

      const patch: Patch = {
        op: "duplicateNode",
        target: { type: "byId", id: "field-1" },
      };

      const result = applyPatch(original, patch);

      // Original should be unchanged
      expect(original.fields).toHaveLength(originalFieldsLength);
      // Result should have new field
      expect(result.fields).toHaveLength(originalFieldsLength + 1);
      // They should be different objects
      expect(result).not.toBe(original);
    });
  });
});

