/**
 * ESLint rule: no-raw-elements
 * 
 * Bans raw HTML elements that have Design System equivalents.
 * Enforces use of DS components instead of raw <input|button|select|textarea>.
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Use Design System components instead of raw HTML elements",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      raw: "Use DS component instead of raw <{{name}}>. Use {{prefer}} from @fragment_ui/ui.",
    },
    schema: [
      {
        type: "object",
        properties: {
          forbidden: {
            type: "array",
            items: { type: "string" },
            description: "List of forbidden HTML element names",
          },
          prefer: {
            type: "object",
            description: "Mapping of HTML element to preferred DS component",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const forbidden = options.forbidden || ["input", "button", "select", "textarea"];
    const prefer = options.prefer || {
      input: "Input",
      button: "Button",
      select: "Select",
      textarea: "Textarea",
    };

    // Track imported components from @fragment_ui/ui
    const importedFromFragmentUI = new Set();

    return {
      // Collect imports from @fragment_ui/ui
      ImportDeclaration(node) {
        if (node.source.value === "@fragment_ui/ui" || node.source.value?.startsWith("@fragment_ui/ui/")) {
          node.specifiers.forEach((specifier) => {
            if (specifier.type === "ImportSpecifier") {
              importedFromFragmentUI.add(specifier.imported.name);
            } else if (specifier.type === "ImportDefaultSpecifier") {
              // Handle default imports if needed
            }
          });
        }
      },
      
      JSXOpeningElement(node) {
        const name = node.name.name;
        
        // Skip if this component is imported from @fragment_ui/ui
        if (importedFromFragmentUI.has(name)) {
          return;
        }
        
        // Check if it's a forbidden raw HTML element
        if (forbidden.includes(name?.toLowerCase())) {
          const preferredComponent = prefer[name?.toLowerCase()] || name;
          
          context.report({
            node,
            messageId: "raw",
            data: {
              name: name?.toLowerCase() || name,
              prefer: preferredComponent,
            },
          });
        }
      },
    };
  },
};

