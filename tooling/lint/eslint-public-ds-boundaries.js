/**
 * ESLint rule: public-ds-boundaries
 * 
 * Ensures that public packages (@fragment_ui/ui, @fragment_ui/tokens, @fragment_ui/blocks)
 * do not import from:
 * - apps/* (internal apps)
 * - internal packages marked private: true
 * - Studio / Playground modules
 * 
 * Based on OSS_PUBLIC_DS_GUIDELINES.md §4: Dependency Boundaries
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Public packages must not import from internal packages or apps",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      forbiddenInternalImport: "Public package '{{packageName}}' cannot import from internal '{{source}}'. Public DS must not depend on internal tooling.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();
    
    // Determine if this file is in a public package
    const isPublicPackage = 
      filename.includes("/packages/ui/") ||
      filename.includes("/packages/tokens/") ||
      filename.includes("/packages/blocks/");
    
    // List of internal packages (marked private: true)
    const internalPackages = [
      "@fragment_ui/mcp-server",
      "@fragment_ui/patches",
      "@fragment_ui/plugin-system",
      "@fragment_ui/scaffolds",
      "@fragment_ui/studio-core",
      "@fragment_ui/telemetry",
      "@fragment_ui/ui-dsl",
      "@fragment_ui/blocks-recipes",
      "@fragment_ui/registry",
      "@fragment_ui/utils",
      "@fragment_ui/cli",
      "@fragment_ui/ui-native",
      "fragment-ui", // vscode-extension
    ];
    
    // Patterns for internal imports
    const internalPatterns = [
      /^apps\//,  // apps/* imports
      /^@fragment\/(mcp-server|patches|plugin-system|scaffolds|studio-core|telemetry|ui-dsl|blocks-recipes|registry|utils|cli|ui-native)/,
      /^fragment-ui$/,  // vscode-extension
    ];
    
    function isInternalImport(source) {
      // Check if it's an internal package
      if (internalPackages.some(pkg => source === pkg || source.startsWith(pkg + "/"))) {
        return true;
      }
      
      // Check if it matches internal patterns
      return internalPatterns.some(pattern => pattern.test(source));
    }
    
    function getPackageName(filename) {
      if (filename.includes("/packages/ui/")) return "@fragment_ui/ui";
      if (filename.includes("/packages/tokens/")) return "@fragment_ui/tokens";
      if (filename.includes("/packages/blocks/")) return "@fragment_ui/blocks";
      return "unknown";
    }
    
    return {
      ImportDeclaration(node) {
        // Only check public packages
        if (!isPublicPackage) {
          return;
        }
        
        const source = node.source.value;
        
        if (typeof source !== "string") {
          return;
        }
        
        // Skip relative imports (./ or ../)
        if (source.startsWith(".")) {
          return;
        }
        
        // Check if this is an internal import
        if (isInternalImport(source)) {
          const packageName = getPackageName(filename);
          context.report({
            node: node.source,
            messageId: "forbiddenInternalImport",
            data: {
              packageName,
              source,
            },
          });
        }
      },
    };
  },
};

