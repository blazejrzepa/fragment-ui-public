/**
 * ESLint rule: design-system-imports-only
 * 
 * Ensures that imports are only from @fragment_ui/ui/* packages.
 * Prevents direct imports from upstream dependencies (e.g., @radix-ui/*).
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Only import from @fragment_ui/ui packages",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      forbiddenImport: "Do not import directly from {{source}}. Use {{preferred}} from @fragment_ui/ui instead.",
      allowedImport: "Import from @fragment_ui/ui is allowed.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowed: {
            type: "array",
            items: { type: "string" },
            description: "List of allowed import sources (regex patterns)",
          },
          forbidden: {
            type: "object",
            description: "Mapping of forbidden imports to preferred alternatives",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const defaultAllowed = [
      "^react$",
      "^react-dom$",
      "^@fragment_ui/",
      "^@/",
      "^\\.",
      "^~/",
      "^next/", // Next.js specific imports (Image, Link, etc.)
      "^react-live$", // Used in playground renderers
      "^prism-react-renderer$", // Used in code highlighting
      "^@babel/standalone$", // Used in playground
      "^@codesandbox/sandpack-react$", // Used in playground
      "^@stackblitz/sdk$", // Used in playground
      "^date-fns$", // Used for date formatting in submissions dashboard
    ];
    // Merge user-provided allowed patterns with defaults
    const allowed = options.allowed ? [...defaultAllowed, ...options.allowed] : defaultAllowed;
    const forbidden = options.forbidden || {
      "@radix-ui/": "@fragment_ui/ui",
      "lucide-react": "@fragment_ui/ui (icons are re-exported)",
      "clsx": "@fragment_ui/ui (clsx is used internally)",
    };

    function isAllowed(source) {
      return allowed.some((pattern) => {
        const regex = new RegExp(pattern);
        return regex.test(source);
      });
    }

    function getForbiddenMatch(source) {
      for (const [pattern, preferred] of Object.entries(forbidden)) {
        if (source.includes(pattern)) {
          return { pattern, preferred };
        }
      }
      return null;
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        
        if (typeof source !== "string") {
          return;
        }

        // First check if it's allowed (allowed takes precedence over forbidden)
        if (isAllowed(source)) {
          return;
        }

        // Then check if it's a forbidden import
        const forbiddenMatch = getForbiddenMatch(source);
        if (forbiddenMatch) {
          context.report({
            node: node.source,
            messageId: "forbiddenImport",
            data: {
              source: source,
              preferred: forbiddenMatch.preferred,
            },
          });
          return;
        }

        // If not allowed and not explicitly forbidden, report as error
        context.report({
          node: node.source,
          messageId: "forbiddenImport",
          data: {
            source: source,
            preferred: "@fragment_ui/ui",
          },
        });
      },
    };
  },
};

