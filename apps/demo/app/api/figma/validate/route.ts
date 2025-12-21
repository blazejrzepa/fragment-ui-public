/**
 * Figma Validation API endpoint
 * 
 * POST /api/figma/validate
 * 
 * Validates Figma component metadata against mapping.json
 * Returns validation result with coverage and issues
 */

import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

/**
 * Figma metadata structure
 */
interface FigmaVariant {
  name: string;
  figmaPath: string;
  tokens?: Record<string, string>;
}

interface FigmaProp {
  name: string;
  figmaName: string;
  values?: (string | number | boolean)[];
}

interface FigmaMetadata {
  name: string;
  figmaComponentId?: string;
  variants?: FigmaVariant[];
  props?: FigmaProp[];
  constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
  tokens?: Record<string, string>;
}

/**
 * Mapping structure (from mapping.json)
 */
interface MappingVariant {
  figma: string;
  code: string;
  tokens?: Record<string, string>;
}

interface MappingProp {
  figma: string;
  code: string;
  values?: (string | number | boolean)[];
}

interface ComponentMapping {
  figmaComponentId?: string;
  variants?: Record<string, MappingVariant>;
  props?: Record<string, MappingProp>;
  constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
}

interface Mapping {
  mappings: Record<string, ComponentMapping>;
}

/**
 * Validation result
 */
interface ValidationResult {
  valid: boolean;
  coverage: number;
  issues: string[];
  missing: {
    variants: string[];
    props: string[];
    tokens: string[];
  };
}

/**
 * Load mapping.json
 */
function loadMapping(): Mapping {
  try {
    const mappingPath = join(
      process.cwd(),
      "packages/registry/mapping.json"
    );
    const mappingData = JSON.parse(readFileSync(mappingPath, "utf-8"));
    return mappingData as Mapping;
  } catch (error: any) {
    console.error("[Figma Validate] Error loading mapping:", error);
    return { mappings: {} };
  }
}

/**
 * Calculate coverage percentage
 */
function calculateCoverage(
  figma: FigmaMetadata,
  mapping: Mapping
): number {
  const componentMapping = mapping.mappings[figma.name];
  if (!componentMapping) {
    return 0;
  }

  let totalItems = 0;
  let foundItems = 0;

  // Check variants
  if (figma.variants && componentMapping.variants) {
    totalItems += figma.variants.length;
    const variantKeys = Object.keys(componentMapping.variants);
    for (const variant of figma.variants) {
      // Check if variant exists in mapping (by name or figma path)
      const found = Object.values(componentMapping.variants).some(
        (mappedVariant) =>
          mappedVariant.figma === variant.figmaPath ||
          variantKeys.includes(variant.name)
      );
      if (found) {
        foundItems++;
      }
    }
  }

  // Check props
  if (figma.props && componentMapping.props) {
    totalItems += figma.props.length;
    for (const prop of figma.props) {
      const found = Object.entries(componentMapping.props).some(
        ([mappedPropName, mappedProp]) =>
          mappedProp.figma === prop.figmaName ||
          mappedPropName === prop.name ||
          mappedProp.code === prop.name
      );
      if (found) {
        foundItems++;
      }
    }
  }

  // Check tokens (if provided)
  if (figma.tokens && componentMapping.variants) {
    // Check tokens against all variants
    const allTokens = new Set<string>();
    Object.values(componentMapping.variants).forEach((variant) => {
      if (variant.tokens) {
        Object.keys(variant.tokens).forEach((token) => allTokens.add(token));
      }
    });

    totalItems += Object.keys(figma.tokens).length;
    Object.keys(figma.tokens).forEach((token) => {
      if (allTokens.has(token)) {
        foundItems++;
      }
    });
  }

  return totalItems > 0 ? (foundItems / totalItems) * 100 : 100;
}

/**
 * Validate Figma metadata against mapping
 */
function validateFigmaMetadata(
  figma: FigmaMetadata,
  mapping: Mapping
): ValidationResult {
  const issues: string[] = [];
  const missing = {
    variants: [] as string[],
    props: [] as string[],
    tokens: [] as string[],
  };

  // Check component exists in mapping
  const componentMapping = mapping.mappings[figma.name];
  if (!componentMapping) {
    issues.push(`Component "${figma.name}" not found in mapping`);
    return {
      valid: false,
      coverage: 0,
      issues,
      missing,
    };
  }

  // Check Figma Component ID match (if provided)
  if (
    figma.figmaComponentId &&
    componentMapping.figmaComponentId &&
    figma.figmaComponentId !== componentMapping.figmaComponentId
  ) {
    issues.push(
      `Figma Component ID mismatch: expected "${componentMapping.figmaComponentId}", got "${figma.figmaComponentId}"`
    );
  }

  // Check variants coverage
  if (figma.variants && componentMapping.variants) {
    const expectedVariants = componentMapping.variants;
    for (const variant of figma.variants) {
      // Check by name first
      if (!expectedVariants[variant.name]) {
        // Check by figma path
        const foundByPath = Object.values(expectedVariants).some(
          (mappedVariant) => mappedVariant.figma === variant.figmaPath
        );
        if (!foundByPath) {
          issues.push(
            `Variant "${variant.name}" (${variant.figmaPath}) not mapped`
          );
          missing.variants.push(variant.name);
        }
      } else {
        // Variant exists, check tokens if provided
        const mappedVariant = expectedVariants[variant.name];
        if (variant.tokens && mappedVariant.tokens) {
          for (const [token, value] of Object.entries(variant.tokens)) {
            if (!mappedVariant.tokens[token]) {
              issues.push(
                `Token "${token}" not in mapping for variant "${variant.name}"`
              );
              missing.tokens.push(`${variant.name}.${token}`);
            }
          }
        }
      }
    }
  }

  // Check props coverage
  if (figma.props && componentMapping.props) {
    const expectedProps = componentMapping.props;
    for (const prop of figma.props) {
      // Check by name first
      if (!expectedProps[prop.name]) {
        // Check by figma name
        const foundByFigmaName = Object.values(expectedProps).some(
          (mappedProp) => mappedProp.figma === prop.figmaName
        );
        if (!foundByFigmaName) {
          issues.push(
            `Prop "${prop.name}" (${prop.figmaName}) not mapped`
          );
          missing.props.push(prop.name);
        }
      } else {
        // Prop exists, check values if provided
        const mappedProp = expectedProps[prop.name];
        if (prop.values && mappedProp.values) {
          for (const value of prop.values) {
            if (!mappedProp.values.includes(value)) {
              issues.push(
                `Value "${value}" for prop "${prop.name}" not in mapping`
              );
            }
          }
        }
      }
    }
  }

  // Check constraints (if provided)
  if (figma.constraints && componentMapping.constraints) {
    const expectedConstraints = componentMapping.constraints;
    if (
      figma.constraints.minWidth &&
      expectedConstraints.minWidth &&
      figma.constraints.minWidth < expectedConstraints.minWidth
    ) {
      issues.push(
        `minWidth constraint (${figma.constraints.minWidth}) is below minimum (${expectedConstraints.minWidth})`
      );
    }
    if (
      figma.constraints.maxWidth &&
      expectedConstraints.maxWidth &&
      figma.constraints.maxWidth > expectedConstraints.maxWidth
    ) {
      issues.push(
        `maxWidth constraint (${figma.constraints.maxWidth}) exceeds maximum (${expectedConstraints.maxWidth})`
      );
    }
  }

  // Calculate coverage
  const coverage = calculateCoverage(figma, mapping);

  // Validation passes if no issues and coverage >= 90%
  const valid = issues.length === 0 && coverage >= 90;

  return {
    valid,
    coverage: Math.round(coverage * 100) / 100,
    issues,
    missing,
  };
}

/**
 * POST /api/figma/validate
 * Validates Figma component metadata
 */
export async function POST(request: NextRequest) {
  try {
    const figmaMetadata: FigmaMetadata = await request.json();

    // Validate required fields
    if (!figmaMetadata.name) {
      return NextResponse.json(
        { error: "Component name is required" },
        { status: 400 }
      );
    }

    // Load mapping
    const mapping = loadMapping();

    // Validate metadata
    const validation = validateFigmaMetadata(figmaMetadata, mapping);

    return NextResponse.json(validation);
  } catch (error: any) {
    console.error("[Figma Validate API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

