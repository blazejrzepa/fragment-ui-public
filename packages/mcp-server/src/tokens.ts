/**
 * Design tokens access
 */

import * as fs from "node:fs/promises";
import * as path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../../..");

export interface Tokens {
  color?: Record<string, any>;
  spacing?: Record<string, any>;
  typography?: Record<string, any>;
  shadow?: Record<string, any>;
  border?: Record<string, any>;
}

/**
 * Get design tokens
 */
export async function getTokens(category?: string): Promise<Tokens> {
  const tokensPath = path.join(ROOT, "packages/tokens/src/tokens.json");
  const tokens = JSON.parse(await fs.readFile(tokensPath, "utf-8"));

  if (category) {
    return { [category]: tokens[category] || {} };
  }

  return tokens;
}

