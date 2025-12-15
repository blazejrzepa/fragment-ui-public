import { describe, expect, it } from "vitest";
import { toKebabCase, toCamelCase, toPascalCase, normalizeComponentName, toDisplayName } from "./naming";

describe("naming utils", () => {
  it("converts to kebab-case", () => {
    expect(toKebabCase("Button")).toBe("button");
    expect(toKebabCase("DataTable")).toBe("data-table");
    expect(toKebabCase("activityFeed")).toBe("activity-feed");
    expect(toKebabCase("data-table")).toBe("data-table");
  });

  it("converts to camelCase", () => {
    expect(toCamelCase("my-component")).toBe("myComponent");
    expect(toCamelCase("MyComponent")).toBe("myComponent");
    expect(toCamelCase("kpi-card")).toBe("kpiCard");
  });

  it("converts to PascalCase", () => {
    expect(toPascalCase("my-component")).toBe("MyComponent");
    expect(toPascalCase("button")).toBe("Button");
    expect(toPascalCase("kpi-card")).toBe("KPICard");
  });

  it("normalizes component names", () => {
    expect(normalizeComponentName("MyComponent")).toBe("my-component");
    expect(normalizeComponentName("data-table")).toBe("data-table");
  });

  it("formats display names", () => {
    expect(toDisplayName("data-table")).toBe("DataTable");
    expect(toDisplayName("button")).toBe("Button");
  });
});

