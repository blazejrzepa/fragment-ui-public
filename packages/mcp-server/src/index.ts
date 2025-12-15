#!/usr/bin/env node

/**
 * Fragment UI MCP Server
 * 
 * Provides AI agents (Cursor/Copilot) with:
 * - Component information and suggestions
 * - Design system rules enforcement
 * - Token validation
 * - Code generation assistance
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { validateCode } from "./validators.js";
import { getComponentInfo, suggestComponent } from "./components.js";
import { generateComponentCode } from "./generators.js";
import { getTokens } from "./tokens.js";
import { listRegistry, getComponentInfo as getRegistryComponentInfo, searchComponents } from "./registry.js";
import { listScaffolds, getScaffoldInfo, createScaffold } from "./scaffolds.js";
import { applyEditPatches, findNodesByQuery, highlightNode } from "./edit.js";
import { listCommits, getCommit, checkoutCommit, getCurrentCommit, getBranches, getCurrentBranch } from "./history.js";
import { setSelection, clearSelection, getCurrentSelection, getSelectionHistory, previousSelection } from "./selection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "../../..");

class FragmentMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "fragment-ui-mcp-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_component_info",
          description: "Get information about a Fragment UI component including props, variants, and usage examples",
          inputSchema: {
            type: "object",
            properties: {
              componentName: {
                type: "string",
                description: "Name of the component (e.g., 'button', 'input', 'dialog')",
              },
            },
            required: ["componentName"],
          },
        },
        {
          name: "suggest_component",
          description: "Suggest Fragment UI components based on a description or use case",
          inputSchema: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "Description of what you need (e.g., 'form input with validation', 'modal dialog')",
              },
            },
            required: ["description"],
          },
        },
        {
          name: "validate_code",
          description: "Validate code against Fragment UI design system rules (tokens, conventions, accessibility)",
          inputSchema: {
            type: "object",
            properties: {
              code: {
                type: "string",
                description: "Code to validate",
              },
              filePath: {
                type: "string",
                description: "Optional file path for context",
              },
            },
            required: ["code"],
          },
        },
        {
          name: "generate_component",
          description: "Generate Fragment UI component code with proper imports, props, and styling",
          inputSchema: {
            type: "object",
            properties: {
              componentName: {
                type: "string",
                description: "Name of the component to generate",
              },
              props: {
                type: "object",
                description: "Component props",
              },
              variant: {
                type: "string",
                description: "Component variant (e.g., 'solid', 'outline', 'ghost')",
              },
            },
            required: ["componentName"],
          },
        },
        {
          name: "get_tokens",
          description: "Get design tokens (colors, spacing, typography) for use in code",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Token category: 'color', 'spacing', 'typography', 'shadow', 'border'",
                enum: ["color", "spacing", "typography", "shadow", "border"],
              },
            },
          },
        },
        {
          name: "edit_apply",
          description: "Apply patches to UI-DSL structure",
          inputSchema: {
            type: "object",
            properties: {
              patches: {
                type: "array",
                description: "Array of patch operations to apply",
                items: { type: "object" },
              },
              dsl: {
                type: "object",
                description: "UI-DSL structure to modify",
              },
            },
            required: ["patches", "dsl"],
          },
        },
        {
          name: "edit_find",
          description: "Find nodes in UI-DSL by query (text, role, or property)",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "object",
                description: "Search query",
                properties: {
                  byText: {
                    type: "string",
                    description: "Search by text content (label, title, placeholder)",
                  },
                  byRole: {
                    type: "string",
                    description: "Search by component type/role",
                  },
                  byProp: {
                    type: "array",
                    description: "Search by property [name, value]",
                    items: {},
                  },
                },
              },
              dsl: {
                type: "object",
                description: "UI-DSL structure to search",
              },
            },
            required: ["query", "dsl"],
          },
        },
        {
          name: "history_list",
          description: "List commits in history",
          inputSchema: {
            type: "object",
            properties: {
              history: {
                type: "object",
                description: "History object",
              },
              options: {
                type: "object",
                description: "Options for filtering and pagination",
                properties: {
                  branch: {
                    type: "string",
                    description: "Filter by branch name",
                  },
                  limit: {
                    type: "number",
                    description: "Maximum number of commits to return",
                  },
                  offset: {
                    type: "number",
                    description: "Number of commits to skip",
                  },
                },
              },
            },
            required: ["history"],
          },
        },
        {
          name: "history_checkout",
          description: "Checkout a specific commit",
          inputSchema: {
            type: "object",
            properties: {
              history: {
                type: "object",
                description: "History object",
              },
              commitId: {
                type: "string",
                description: "Commit ID to checkout",
              },
            },
            required: ["history", "commitId"],
          },
        },
        {
          name: "history_get",
          description: "Get a specific commit by ID",
          inputSchema: {
            type: "object",
            properties: {
              history: {
                type: "object",
                description: "History object",
              },
              commitId: {
                type: "string",
                description: "Commit ID",
              },
            },
            required: ["history", "commitId"],
          },
        },
        {
          name: "history_branches",
          description: "Get list of branches",
          inputSchema: {
            type: "object",
            properties: {
              history: {
                type: "object",
                description: "History object",
              },
            },
            required: ["history"],
          },
        },
        {
          name: "selection_set",
          description: "Set the current selection",
          inputSchema: {
            type: "object",
            properties: {
              selection: {
                type: "object",
                description: "Selection state object",
              },
              ref: {
                type: "object",
                description: "NodeRef to select",
                properties: {
                  type: {
                    type: "string",
                    enum: ["byId", "byPath", "byTestId"],
                  },
                  id: {
                    type: "string",
                    description: "Node ID (for byId)",
                  },
                  path: {
                    type: "string",
                    description: "Node path (for byPath)",
                  },
                  testId: {
                    type: "string",
                    description: "Test ID (for byTestId)",
                  },
                },
              },
            },
            required: ["selection", "ref"],
          },
        },
        {
          name: "selection_clear",
          description: "Clear the current selection",
          inputSchema: {
            type: "object",
            properties: {
              selection: {
                type: "object",
                description: "Selection state object",
              },
            },
            required: ["selection"],
          },
        },
        {
          name: "selection_get",
          description: "Get the current selection",
          inputSchema: {
            type: "object",
            properties: {
              selection: {
                type: "object",
                description: "Selection state object",
              },
            },
            required: ["selection"],
          },
        },
        {
          name: "list_registry",
          description: "List all components in the Fragment UI registry with their file paths",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "search_components",
          description: "Search for components in the registry by name",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query (component name or part of it)",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "list_scaffolds",
          description: "List all available scaffolds (layout components)",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_scaffold_info",
          description: "Get information about a specific scaffold",
          inputSchema: {
            type: "object",
            properties: {
              scaffoldName: {
                type: "string",
                description: "Name of the scaffold (form-auth, two-column, settings-page)",
              },
            },
            required: ["scaffoldName"],
          },
        },
        {
          name: "create_scaffold",
          description: "Generate code using a scaffold with UI-DSL configuration",
          inputSchema: {
            type: "object",
            properties: {
              scaffoldName: {
                type: "string",
                description: "Name of the scaffold (form-auth, two-column, settings-page)",
              },
              uiDsl: {
                type: "object",
                description: "UI-DSL object with scaffold configuration",
              },
            },
            required: ["scaffoldName", "uiDsl"],
          },
        },
      ],
    }));

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: "fragment://components",
          name: "Fragment UI Components",
          description: "List of all available Fragment UI components",
          mimeType: "application/json",
        },
        {
          uri: "fragment://tokens",
          name: "Design Tokens",
          description: "All design tokens (colors, spacing, typography)",
          mimeType: "application/json",
        },
        {
          uri: "fragment://rules",
          name: "Design System Rules",
          description: "Enforcement rules and conventions",
          mimeType: "application/json",
        },
      ],
    }));

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === "fragment://components") {
        const registryPath = path.join(ROOT, "packages/registry/registry.json");
        const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"));
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }

      if (uri === "fragment://tokens") {
        const tokens = await getTokens();
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(tokens, null, 2),
            },
          ],
        };
      }

      if (uri === "fragment://rules") {
        const rulesPath = path.join(ROOT, "mcp/rules.json");
        const rules = JSON.parse(await fs.readFile(rulesPath, "utf-8"));
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(rules, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_component_info": {
            const info = await getComponentInfo(args?.componentName as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(info, null, 2),
                },
              ],
            };
          }

          case "suggest_component": {
            const suggestions = await suggestComponent(args?.description as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(suggestions, null, 2),
                },
              ],
            };
          }

          case "validate_code": {
            const validation = await validateCode(
              args?.code as string,
              args?.filePath as string | undefined
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(validation, null, 2),
                },
              ],
            };
          }

          case "generate_component": {
            const code = await generateComponentCode(
              args?.componentName as string,
              args?.props as Record<string, any> | undefined,
              args?.variant as string | undefined
            );
            return {
              content: [
                {
                  type: "text",
                  text: code,
                },
              ],
            };
          }

          case "get_tokens": {
            const tokens = await getTokens(args?.category as string | undefined);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(tokens, null, 2),
                },
              ],
            };
          }

          case "list_registry": {
            const registry = listRegistry();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(registry, null, 2),
                },
              ],
            };
          }

          case "search_components": {
            const results = searchComponents(args?.query as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case "list_scaffolds": {
            const scaffolds = listScaffolds();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(scaffolds, null, 2),
                },
              ],
            };
          }

          case "edit_apply": {
            const result = applyEditPatches(
              args?.dsl as any,
              args?.patches as any[]
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "edit_find": {
            const results = findNodesByQuery(
              args?.dsl as any,
              args?.query as { byText?: string; byRole?: string; byProp?: [string, any] }
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case "history_list": {
            const commits = listCommits(
              args?.history as any,
              args?.options as { branch?: string; limit?: number; offset?: number } | undefined
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(commits, null, 2),
                },
              ],
            };
          }

          case "history_checkout": {
            const result = checkoutCommit(
              args?.history as any,
              args?.commitId as string
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "history_get": {
            const commit = getCommit(
              args?.history as any,
              args?.commitId as string
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(commit, null, 2),
                },
              ],
            };
          }

          case "history_branches": {
            const branches = getBranches(args?.history as any);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(branches, null, 2),
                },
              ],
            };
          }

          case "selection_set": {
            const newSelection = setSelection(
              args?.selection as any,
              args?.ref as any
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(newSelection, null, 2),
                },
              ],
            };
          }

          case "selection_clear": {
            const newSelection = clearSelection(args?.selection as any);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(newSelection, null, 2),
                },
              ],
            };
          }

          case "selection_get": {
            const current = getCurrentSelection(args?.selection as any);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(current, null, 2),
                },
              ],
            };
          }

          case "get_scaffold_info": {
            const info = getScaffoldInfo(args?.scaffoldName as string);
            if (!info) {
              throw new Error(`Unknown scaffold: ${args?.scaffoldName}`);
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(info, null, 2),
                },
              ],
            };
          }

          case "create_scaffold": {
            const code = await createScaffold(
              args?.scaffoldName as string,
              args?.uiDsl as Record<string, any>
            );
            return {
              content: [
                {
                  type: "text",
                  text: code,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Fragment UI MCP Server running on stdio");
  }
}

// Start server
const server = new FragmentMCPServer();
server.run().catch(console.error);

