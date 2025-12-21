import { describe, it, expect } from "vitest";
import { generateJsxRuntimeReplacement } from "./jsx-runtime-replacement";

describe("jsx-runtime-replacement", () => {
  it("should generate jsx-runtime replacement code with correct structure", () => {
    const code = generateJsxRuntimeReplacement();
    
    // Verify essential parts of the replacement code
    expect(code).toContain("import React from \"react\"");
    expect(code).toContain("REACT_ELEMENT_TYPE");
    expect(code).toContain("function jsx(type, props, key)");
    expect(code).toContain("typeof type === 'object'");
    expect(code).toContain("React.createElement");
    expect(code).toContain("export { jsx }");
    expect(code).toContain("export const jsxs = jsx");
    expect(code).toContain("export const jsxDEV = jsx");
    expect(code).toContain("export const Fragment = React.Fragment");
  });

  it("should handle object components (Radix UI primitives)", () => {
    const code = generateJsxRuntimeReplacement();
    
    // Verify object component handling
    expect(code).toContain("typeof type === 'object' && type !== null && typeof type !== 'function'");
    expect(code).toContain("type.$$typeof");
    expect(code).toContain("normalizedProps");
  });

  it("should use React.createElement for function components", () => {
    const code = generateJsxRuntimeReplacement();
    
    // Verify fallback to React.createElement
    expect(code).toContain("return React.createElement(type, props, key)");
  });

  it("should generate deterministic code (snapshot)", () => {
    const code1 = generateJsxRuntimeReplacement();
    const code2 = generateJsxRuntimeReplacement();
    
    // Verify deterministic output
    expect(code1).toBe(code2);
    
    // Snapshot test - this ensures the code structure doesn't change unexpectedly
    expect(code1).toMatchSnapshot();
  });
});

