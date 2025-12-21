/**
 * ESLint Rule: no-uncontracted-actions
 * 
 * Ensures that all Button/CTA components have data-action-* attributes (Action Contracts).
 * This is required for AXL (Agentic Experience Layer) - agent-readable UI.
 * 
 * Rule: Button components without data-action-id are considered "uncontracted actions"
 * and should trigger an error.
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Require data-action-* attributes on Button/CTA components for AXL",
      category: "AXL",
      recommended: true,
    },
    messages: {
      missingActionContract: "Button/CTA component must have data-action-id attribute (Action Contract required for AXL)",
      missingActionKind: "Button/CTA with data-action-id must also have data-action-kind attribute",
    },
    schema: [],
  },
  create(context) {
    /**
     * Check if a JSX element is a Button or CTA component
     */
    function isButtonOrCTA(node) {
      if (!node || node.type !== "JSXOpeningElement") {
        return false;
      }
      
      const elementName = node.name?.name || node.name?.object?.name;
      
      // Check for Button component (from @fragment_ui/ui)
      if (elementName === "Button") {
        return true;
      }
      
      // Check for button HTML element with type="submit" or variant indicating CTA
      if (elementName === "button") {
        const typeAttr = node.attributes?.find(
          attr => attr.name?.name === "type" && 
          (attr.value?.value === "submit" || attr.value?.value === "button")
        );
        if (typeAttr) {
          return true;
        }
      }
      
      return false;
    }
    
    /**
     * Check if element has data-action-id attribute
     */
    function hasActionContract(node) {
      if (!node.attributes) {
        return false;
      }
      
      return node.attributes.some(
        attr => attr.name?.name === "data-action-id"
      );
    }
    
    /**
     * Check if element has data-action-kind attribute
     */
    function hasActionKind(node) {
      if (!node.attributes) {
        return false;
      }
      
      return node.attributes.some(
        attr => attr.name?.name === "data-action-kind"
      );
    }
    
    return {
      JSXOpeningElement(node) {
        if (isButtonOrCTA(node)) {
          // Check if it has data-action-id (Action Contract)
          if (!hasActionContract(node)) {
            context.report({
              node,
              messageId: "missingActionContract",
            });
          } else {
            // If it has data-action-id, it should also have data-action-kind
            if (!hasActionKind(node)) {
              context.report({
                node,
                messageId: "missingActionKind",
              });
            }
          }
        }
      },
    };
  },
};

