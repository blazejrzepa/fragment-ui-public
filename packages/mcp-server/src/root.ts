import fs from "node:fs";
import path from "node:path";

/**
 * Resolve Fragment UI repo root.
 *
 * Why: the MCP server needs to read workspace files like:
 * - packages/registry/registry.json
 * - packages/tokens/src/tokens.json
 * - mcp/rules.json
 *
 * When the server is executed via npx (or from node_modules), `__dirname` is not the repo root.
 * In that case we prefer process.cwd() and walk upwards.
 */
export function getRepoRoot(): string {
  const envRoot = process.env.FRAGMENT_UI_ROOT;
  if (envRoot && envRoot.trim()) return envRoot.trim();

  const start = process.cwd();
  const candidates: string[] = [];
  let dir = start;
  for (let i = 0; i < 8; i++) {
    candidates.push(dir);
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  for (const c of candidates) {
    const registry = path.join(c, "packages/registry/registry.json");
    const tokens = path.join(c, "packages/tokens/src/tokens.json");
    const rules = path.join(c, "mcp/rules.json");
    if (fs.existsSync(registry) && fs.existsSync(tokens) && fs.existsSync(rules)) {
      return c;
    }

    // fallback marker for monorepo root
    if (fs.existsSync(path.join(c, "pnpm-workspace.yaml"))) {
      return c;
    }
  }

  // Final fallback: works when running from this repo (packages/mcp-server/dist -> ../../..)
  return path.join(__dirname, "../../..");
}


