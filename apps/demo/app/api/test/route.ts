import { NextRequest, NextResponse } from "next/server";
// @ts-ignore - @babel/standalone doesn't have types
import * as Babel from "@babel/standalone";

/**
 * API Route for testing generated code
 * 
 * This endpoint validates code without requiring browser rendering
 * (browser tests are done client-side)
 */

interface TestRequest {
  code: string;
}

interface TestResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    codeValid: boolean;
    propsValid: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { code }: TestRequest = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const result: TestResult = {
      success: false,
      errors: [],
      warnings: [],
      checks: {
        codeValid: false,
        propsValid: false,
      },
    };

    // Check 1: Validate code syntax
    try {
      Babel.transform(code, {
        presets: [
          ["react", { runtime: "classic" }],
          ["typescript", { isTSX: true, allExtensions: true }],
        ],
      });
      result.checks.codeValid = true;
    } catch (error) {
      result.errors.push(
        `Syntax error: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Check 2: Validate component props
    const propsValidation = validateComponentProps(code);
    result.checks.propsValid = propsValidation.valid;
    if (!propsValidation.valid) {
      result.warnings.push(
        ...propsValidation.missing.map(
          (m) =>
            `Missing required props for ${m.component}: ${m.props.join(", ")}`
        )
      );
    }

    // Determine overall success
    result.success = result.checks.codeValid && result.checks.propsValid;

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to test code",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Validate that all components have required props
 */
function validateComponentProps(code: string): {
  valid: boolean;
  missing: Array<{ component: string; props: string[] }>;
} {
  const missing: Array<{ component: string; props: string[] }> = [];

  // Required props for common components
  const requiredProps: Record<string, string[]> = {
    Pagination: ["currentPage", "totalPages", "onPageChange"],
    Select: ["value", "onValueChange"], // Or sub-components
  };

  // Check for each component
  Object.entries(requiredProps).forEach(([component, props]) => {
    // Check if component is used in code
    if (code.includes(`<${component}`) || code.includes(`${component}(`)) {
      const missingProps: string[] = [];

      props.forEach((prop) => {
        // Check if prop is present (simple regex check)
        const propPattern = new RegExp(`${prop}\\s*[:=]`, "i");
        if (!propPattern.test(code)) {
          missingProps.push(prop);
        }
      });

      if (missingProps.length > 0) {
        missing.push({ component, props: missingProps });
      }
    }
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

