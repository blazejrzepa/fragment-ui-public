/**
 * Component Migration Assistant
 * 
 * Automatically migrates components between versions using AST transformations
 */

import * as fs from "fs";
import * as path from "path";
import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface MigrationRule {
  fromVersion: string;
  toVersion: string;
  componentName: string;
  transform: (node: t.Node) => t.Node | null;
  description: string;
}

export interface MigrationResult {
  file: string;
  success: boolean;
  changes: string[];
  error?: string;
}

/**
 * Migration rules for common component changes
 */
const migrationRules: MigrationRule[] = [
  {
    fromVersion: "1.0.0",
    toVersion: "1.1.0",
    componentName: "Button",
    description: "Migrate Button variant prop from 'default' to 'solid'",
    transform: (node) => {
      if (t.isJSXOpeningElement(node) && t.isJSXIdentifier(node.name)) {
        if (node.name.name === "Button") {
          const variantAttr = node.attributes.find(
            (attr: t.JSXAttribute | t.JSXSpreadAttribute) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === "variant"
          ) as t.JSXAttribute | undefined;

          if (variantAttr && t.isStringLiteral(variantAttr.value)) {
            if (variantAttr.value.value === "default") {
              variantAttr.value.value = "solid";
            }
          }
        }
      }
      return node;
    },
  },
  {
    fromVersion: "1.1.0",
    toVersion: "1.2.0",
    componentName: "Input",
    description: "Add error prop support to Input component",
    transform: (node) => {
      // This is a placeholder - actual transformation would be more complex
      return node;
    },
  },
];

/**
 * Migrate a single file
 */
export function migrateFile(
  filePath: string,
  fromVersion: string,
  toVersion: string,
  componentName?: string
): MigrationResult {
  const changes: string[] = [];
  let error: string | undefined;

  try {
    const code = fs.readFileSync(filePath, "utf-8");
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy", "classProperties"],
    });

    const rules = migrationRules.filter(
      (rule) =>
        rule.fromVersion === fromVersion &&
        rule.toVersion === toVersion &&
        (!componentName || rule.componentName === componentName)
    );

    if (rules.length === 0) {
      return {
        file: filePath,
        success: false,
        changes: [],
        error: `No migration rules found for ${fromVersion} → ${toVersion}`,
      };
    }

    traverse(ast, {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        rules.forEach((rule) => {
          const transformed = rule.transform(path.node);
          if (transformed && transformed !== path.node) {
            path.replaceWith(transformed);
            changes.push(rule.description);
          }
        });
      },
    });

    const output = generate(ast, {}, code);
    fs.writeFileSync(filePath, output.code);

    return {
      file: filePath,
      success: true,
      changes,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    return {
      file: filePath,
      success: false,
      changes: [],
      error,
    };
  }
}

/**
 * Migrate all files in a directory
 */
export function migrateDirectory(
  dirPath: string,
  fromVersion: string,
  toVersion: string,
  componentName?: string,
  extensions: string[] = [".tsx", ".ts", ".jsx", ".js"]
): MigrationResult[] {
  const results: MigrationResult[] = [];

  function walkDir(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      // Skip node_modules and other common directories
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
          walkDir(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          results.push(migrateFile(fullPath, fromVersion, toVersion, componentName));
        }
      }
    }
  }

  walkDir(dirPath);
  return results;
}

/**
 * List available migrations
 */
export function listMigrations(): MigrationRule[] {
  return migrationRules;
}

