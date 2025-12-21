/**
 * Tests for AXL (Agentic Experience Layer) validation
 * 
 * Tests Action Contracts validation rules:
 * - kind="hard" ⇒ requiresConfirmation=true
 * - riskLevel="high" ⇒ requiresConfirmation=true
 * - preauthAllowed=true tylko dla kind="soft"
 */

import { describe, it, expect } from "vitest";
import { validateDsl } from "../validator";
import type { UiForm, ActionContract, UiPage, UiModule } from "../types";
import { generateId } from "../types";

describe("AXL Validation - Action Contracts", () => {
  it("should pass validation for valid soft action", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Cancel",
        },
      ],
    };
    
    // Add ActionContract via UiCommon.actions (separate from form actions)
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Save Draft",
          kind: "soft" as const,
          riskLevel: "low" as const,
          preauthAllowed: true,
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    if (!result.valid) {
      console.log("Validation errors:", result.errors);
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail validation for hard action without confirmation", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Delete",
        },
      ],
    };
    
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Delete Account",
          kind: "hard" as const,
          // Missing requiresConfirmation
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "HARD_ACTION_MISSING_CONFIRMATION")).toBe(true);
  });

  it("should fail validation for high risk action without confirmation", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Submit",
        },
      ],
    };
    
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Submit Payment",
          kind: "soft" as const,
          riskLevel: "high" as const,
          // Missing requiresConfirmation
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "HIGH_RISK_MISSING_CONFIRMATION")).toBe(true);
  });

  it("should fail validation for preauthAllowed on hard action", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Delete",
        },
      ],
    };
    
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Delete Account",
          kind: "hard" as const,
          requiresConfirmation: true,
          preauthAllowed: true, // Invalid: preauthAllowed only for soft
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "PREAUTH_ONLY_FOR_SOFT")).toBe(true);
  });

  it("should pass validation for hard action with confirmation", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Delete",
        },
      ],
    };
    
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Delete Account",
          kind: "hard" as const,
          requiresConfirmation: true,
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    if (!result.valid) {
      console.log("Validation errors:", result.errors);
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should pass validation for high risk action with confirmation", () => {
    const actionId = generateId();
    const form: UiForm = {
      id: generateId(),
      type: "form",
      fields: [
        {
          id: generateId(),
          name: "email",
          label: "Email",
          component: "Input",
        },
      ],
      actions: [
        {
          id: actionId,
          type: "button",
          label: "Submit",
        },
      ],
    };
    
    const dsl = Object.assign(form, {
      actions: [
        {
          id: actionId,
          label: "Submit Payment",
          kind: "soft" as const,
          riskLevel: "high" as const,
          requiresConfirmation: true,
        },
      ] as ActionContract[],
    });

    const result = validateDsl(dsl);
    if (!result.valid) {
      console.log("Validation errors:", result.errors);
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("Milestone 3.1: Screen DSL Validation", () => {
  it("should validate screen with regions", () => {
    const dsl: UiPage = {
      id: generateId(),
      type: "screen",
      title: "Dashboard Screen",
      regions: {
        header: {
          id: generateId(),
          modules: [
            {
              id: generateId(),
              type: "navigation",
              props: { logo: "App", items: ["Home"] },
            },
          ],
        },
        content: {
          id: generateId(),
          modules: [
            {
              id: generateId(),
              type: "hero",
              title: "Welcome",
            },
          ],
        },
      },
      sections: [],
    };

    const result = validateDsl(dsl);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should validate page with module in section", () => {
    const dsl: UiPage = {
      id: generateId(),
      type: "page",
      title: "Pricing Page",
      sections: [
        {
          id: generateId(),
          kind: "content",
          content: [],
          module: "pricing",
          moduleProps: {
            tiers: [{ name: "Basic", price: "$9" }],
          },
        },
      ],
    };

    const result = validateDsl(dsl);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail validation for invalid module type", () => {
    const dsl: UiPage = {
      id: generateId(),
      type: "page",
      title: "Test Page",
      sections: [
        {
          id: generateId(),
          kind: "content",
          content: [],
          module: "invalid-module" as any,
        },
      ],
    };

    const result = validateDsl(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "INVALID_MODULE_TYPE")).toBe(true);
  });

  it("should fail validation for region without id", () => {
    const dsl: UiPage = {
      id: generateId(),
      type: "screen",
      title: "Test Screen",
      regions: {
        header: {
          id: "", // Invalid: empty ID
          modules: [],
        },
      },
      sections: [],
    };

    const result = validateDsl(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "MISSING_REGION_ID" || e.code === "INVALID_REGION_ID")).toBe(true);
  });
});
