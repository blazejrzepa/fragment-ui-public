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
  space?: Record<string, any>;
  density?: Record<string, any>;
  motion?: Record<string, any>;
  radius?: Record<string, any>;
  shadow?: Record<string, any>;
  typography?: Record<string, any>;
  i18n?: Record<string, any>;
  modes?: Record<string, any>;
}

/**
 * Get design tokens
 */
export async function getTokens(category?: string): Promise<Tokens> {
  const tokensPath = path.join(ROOT, "packages/tokens/src/tokens.json");
  const tokens = JSON.parse(await fs.readFile(tokensPath, "utf-8"));

  if (category) {
    const normalizedCategory = category === "spacing" ? "space" : category;
    return { [normalizedCategory]: tokens[normalizedCategory] || {} };
  }

  return tokens;
}

