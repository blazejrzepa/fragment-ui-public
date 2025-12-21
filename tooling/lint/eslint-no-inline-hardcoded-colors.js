/**
 * ESLint rule: no-inline-hardcoded-colors
 * 
 * Prevents hard-coded color values in JSX/TSX.
 * Enforces use of design tokens (CSS variables or Tailwind classes).
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Use design tokens instead of hard-coded colors",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      hardcodedColor: "Do not use hard-coded color '{{color}}'. Use design tokens (CSS variables or Tailwind classes) instead.",
      hexColor: "Do not use hex color '{{color}}'. Use design tokens instead.",
      rgbColor: "Do not use rgb/rgba color '{{color}}'. Use design tokens instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInComments: {
            type: "boolean",
            description: "Allow hard-coded colors in comments",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const allowInComments = options.allowInComments || false;

    // Patterns for hard-coded colors
    const hexPattern = /#[0-9A-Fa-f]{3,6}\b/g;
    const rgbPattern = /rgba?\([^)]+\)/g;
    const namedColors = [
      "red", "green", "blue", "yellow", "orange", "purple", "pink", "cyan",
      "black", "white", "gray", "grey", "brown", "navy", "teal", "lime",
      "maroon", "olive", "silver", "aqua", "fuchsia",
    ];

    function checkStringLiteral(node, value) {
      if (typeof value !== "string") {
        return;
      }

      // Check for hex colors
      const hexMatches = value.match(hexPattern);
      if (hexMatches) {
        hexMatches.forEach((match) => {
          context.report({
            node,
            messageId: "hexColor",
            data: { color: match },
          });
        });
      }

      // Check for rgb/rgba colors
      const rgbMatches = value.match(rgbPattern);
      if (rgbMatches) {
        rgbMatches.forEach((match) => {
          context.report({
            node,
            messageId: "rgbColor",
            data: { color: match },
          });
        });
      }

      // Check for named colors (case-insensitive)
      const lowerValue = value.toLowerCase();
      namedColors.forEach((color) => {
        // Match whole word to avoid false positives
        const regex = new RegExp(`\\b${color}\\b`, "i");
        if (regex.test(lowerValue)) {
          // Allow if it's part of a token name (e.g., "text-red-500" is OK)
          if (!lowerValue.includes("var(--") && !lowerValue.includes("text-") && !lowerValue.includes("bg-")) {
            context.report({
              node,
              messageId: "hardcodedColor",
              data: { color: color },
            });
          }
        }
      });
    }

    return {
      // Check JSX attributes (style, className with inline styles)
      JSXAttribute(node) {
        if (node.name && node.name.name === "style" && node.value?.type === "JSXExpressionContainer") {
          const expression = node.value.expression;
          if (expression.type === "ObjectExpression") {
            expression.properties.forEach((prop) => {
              if (prop.key && prop.key.name && (prop.key.name === "color" || prop.key.name === "backgroundColor" || prop.key.name === "borderColor")) {
                if (prop.value.type === "Literal") {
                  checkStringLiteral(prop.value, prop.value.value);
                }
              }
            });
          }
        }
      },
      // Check string literals in JSX
      Literal(node) {
        if (node.parent && node.parent.type === "JSXAttribute" && node.parent.name && node.parent.name.name === "style") {
          checkStringLiteral(node, node.value);
        }
      },
      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach((quasi) => {
          checkStringLiteral(quasi, quasi.value.raw);
        });
      },
    };
  },
};

