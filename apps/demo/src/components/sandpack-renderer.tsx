"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

/**
 * SandpackRenderer - Professional code editor and preview using CodeSandbox's Sandpack
 * 
 * Advantages over React Live:
 * - Native TypeScript support (no manual type stripping needed)
 * - Professional code editor with syntax highlighting
 * - Better error handling
 * - Export to CodeSandbox
 * - More reliable transpilation
 * 
 * Uses local bundler API to provide @fragment_ui/ui package
 */
interface SandpackRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

export function SandpackRenderer({ code, onError }: SandpackRendererProps) {
  const [bundledUI, setBundledUI] = useState<string | null>(null);
  const [bundledCSS, setBundledCSS] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load bundled UI package and CSS from local API
  useEffect(() => {
    const loadBundledAssets = async () => {
      try {
        // Load both JS bundle and CSS
        const [jsResponse, cssResponse] = await Promise.all([
          fetch("/api/bundle"),
          fetch("/api/bundle-css"),
        ]);

        if (!jsResponse.ok) {
          throw new Error(`Failed to load bundle: ${jsResponse.statusText}`);
        }
        if (!cssResponse.ok) {
          throw new Error(`Failed to load CSS: ${cssResponse.statusText}`);
        }

        const [bundled, css] = await Promise.all([
          jsResponse.text(),
          cssResponse.text(),
        ]);

        setBundledUI(bundled);
        setBundledCSS(css);
      } catch (error) {
        console.error("Failed to load bundled assets:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    loadBundledAssets();
  }, [onError]);

  // Transform code to replace @fragment_ui/ui imports with local module
  let transformedCode = code;
  if (bundledUI) {
    // Replace @fragment_ui/ui imports with local module path
    // Handles both single and double quotes, and different spacing
    transformedCode = code.replace(
      /from\s+["']@fragment\/ui["']/g,
      'from "./fragment-ui.js"'
    );
    // Also handle import statements without 'from'
    transformedCode = transformedCode.replace(
      /import\s+["']@fragment\/ui["']/g,
      'import "./fragment-ui.js"'
    );
  }
  
  // Wrap component to inject CSS if CSS is available
  if (bundledCSS && bundledCSS.length > 0) {
    console.log("Wrapping component with CSS injection, CSS size:", bundledCSS.length);
    
    // Find the component name
    const componentNameMatch = transformedCode.match(/export\s+default\s+function\s+(\w+)/);
    const componentName = componentNameMatch?.[1] || 'App';
    
    // Create wrapper that injects CSS and renders the original component
    transformedCode = `
import React, { useLayoutEffect } from "react";

// Inject CSS immediately when module loads (synchronous, before React renders)
(function injectCSS() {
  if (typeof document !== "undefined" && document.head) {
    // Add Tailwind CDN
    if (!document.getElementById("tailwind-cdn")) {
      const tailwindLink = document.createElement("link");
      tailwindLink.id = "tailwind-cdn";
      tailwindLink.rel = "stylesheet";
      tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css";
      document.head.insertBefore(tailwindLink, document.head.firstChild);
    }
    
    // Add Fragment UI styles
    if (!document.getElementById("fragment-ui-styles")) {
      const style = document.createElement("style");
      style.id = "fragment-ui-styles";
      style.textContent = ${JSON.stringify(bundledCSS)};
      document.head.insertBefore(style, document.head.firstChild);
    }
  }
})();

${transformedCode}

// Wrap original component to ensure CSS is loaded
const OriginalComponent = ${componentName};
export default function App() {
  // Ensure CSS is loaded on mount (synchronous)
  useLayoutEffect(() => {
    if (typeof document !== "undefined" && document.head) {
      // Add Tailwind CDN
      if (!document.getElementById("tailwind-cdn")) {
        const tailwindLink = document.createElement("link");
        tailwindLink.id = "tailwind-cdn";
        tailwindLink.rel = "stylesheet";
        tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css";
        document.head.insertBefore(tailwindLink, document.head.firstChild);
      }
      
      // Add Fragment UI styles
      if (!document.getElementById("fragment-ui-styles")) {
        const style = document.createElement("style");
        style.id = "fragment-ui-styles";
        style.textContent = ${JSON.stringify(bundledCSS)};
        document.head.insertBefore(style, document.head.firstChild);
      }
    }
  }, []);
  
  return React.createElement(OriginalComponent);
}
`;
  } else {
    console.log("No CSS to inject, bundledCSS:", bundledCSS ? "empty" : "null");
  }

  // Create a complete file structure for Sandpack
  const files: Record<string, string> = {
    "/App.tsx": transformedCode,
    "/index.tsx": `import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Component to inject CSS synchronously before React renders
function StyleInjector() {
  useLayoutEffect(() => {
    // Add Tailwind CDN
    if (!document.getElementById("tailwind-cdn")) {
      const tailwindLink = document.createElement("link");
      tailwindLink.id = "tailwind-cdn";
      tailwindLink.rel = "stylesheet";
      tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css";
      document.head.appendChild(tailwindLink);
    }
    
    // Add Fragment UI styles
    if (!document.getElementById("fragment-ui-styles")) {
      const style = document.createElement("style");
      style.id = "fragment-ui-styles";
      style.textContent = ${JSON.stringify(bundledCSS || "")};
      document.head.appendChild(style);
    }
  }, []);
  
  return null;
}

// Inject CSS immediately when module loads (before React renders)
if (typeof document !== "undefined") {
  // Add Tailwind CDN
  if (!document.getElementById("tailwind-cdn")) {
    const tailwindLink = document.createElement("link");
    tailwindLink.id = "tailwind-cdn";
    tailwindLink.rel = "stylesheet";
    tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css";
    document.head.appendChild(tailwindLink);
  }
  
  // Add Fragment UI styles
  if (!document.getElementById("fragment-ui-styles")) {
    const style = document.createElement("style");
    style.id = "fragment-ui-styles";
    style.textContent = ${JSON.stringify(bundledCSS || "")};
    document.head.appendChild(style);
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <StyleInjector />
    <App />
  </React.StrictMode>
);`,
    "/package.json": JSON.stringify({
      name: "fragment-ui-playground",
      version: "1.0.0",
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
    }, null, 2),
  };

  // Add bundled UI as a local file
  if (bundledUI) {
    files["/fragment-ui.js"] = bundledUI;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[color:var(--color-fg-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ height: "100%" }}>
      <Sandpack
        template="react-ts"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {
            // Don't include @fragment_ui/ui in dependencies - we provide it as local module
          },
        }}
        options={{
          showNavigator: false,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: "100%",
          editorWidthPercentage: 50,
        }}
      />
    </div>
  );
}

/**
 * SandpackCodeEditor - Code editor only (for Code tab)
 */
interface SandpackCodeEditorProps {
  code: string;
  onError?: (error: Error) => void;
}

export function SandpackCodeEditor({ code, onError }: SandpackCodeEditorProps) {
  const [bundledUI, setBundledUI] = useState<string | null>(null);
  const [bundledCSS, setBundledCSS] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundledAssets = async () => {
      try {
        // Load both JS bundle and CSS
        const [jsResponse, cssResponse] = await Promise.all([
          fetch("/api/bundle"),
          fetch("/api/bundle-css"),
        ]);

        if (!jsResponse.ok) {
          throw new Error(`Failed to load bundle: ${jsResponse.statusText}`);
        }
        if (!cssResponse.ok) {
          throw new Error(`Failed to load CSS: ${cssResponse.statusText}`);
        }

        const [bundled, css] = await Promise.all([
          jsResponse.text(),
          cssResponse.text(),
        ]);

        setBundledUI(bundled);
        setBundledCSS(css);
      } catch (error) {
        console.error("Failed to load bundled assets:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    loadBundledAssets();
  }, [onError]);

  // Transform code to replace @fragment_ui/ui imports with local module
  let transformedCode = code;
  if (bundledUI) {
    transformedCode = code.replace(
      /from\s+["']@fragment\/ui["']/g,
      'from "./fragment-ui.js"'
    );
  }

  const files: Record<string, string> = {
    "/App.tsx": transformedCode,
  };

  if (bundledUI) {
    files["/fragment-ui.js"] = bundledUI;
  }

  if (bundledCSS) {
    files["/styles.css"] = bundledCSS;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[color:var(--color-fg-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ height: "100%" }}>
      <Sandpack
        template="react-ts"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {},
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: "100%",
          readOnly: false,
        }}
      />
    </div>
  );
}

/**
 * SandpackPreview - Preview only (for Preview tab)
 */
interface SandpackPreviewProps {
  code: string;
  onError?: (error: Error) => void;
}

export function SandpackPreview({ code, onError }: SandpackPreviewProps) {
  const [bundledUI, setBundledUI] = useState<string | null>(null);
  const [bundledCSS, setBundledCSS] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundledAssets = async () => {
      try {
        // Load both JS bundle and CSS
        const [jsResponse, cssResponse] = await Promise.all([
          fetch("/api/bundle"),
          fetch("/api/bundle-css"),
        ]);

        if (!jsResponse.ok) {
          throw new Error(`Failed to load bundle: ${jsResponse.statusText}`);
        }
        if (!cssResponse.ok) {
          throw new Error(`Failed to load CSS: ${cssResponse.statusText}`);
        }

        const [bundled, css] = await Promise.all([
          jsResponse.text(),
          cssResponse.text(),
        ]);

        setBundledUI(bundled);
        setBundledCSS(css);
      } catch (error) {
        console.error("Failed to load bundled assets:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    loadBundledAssets();
  }, [onError]);

  // Transform code to replace @fragment_ui/ui imports with local module
  let transformedCode = code;
  if (bundledUI) {
    transformedCode = code.replace(
      /from\s+["']@fragment\/ui["']/g,
      'from "./fragment-ui.js"'
    );
  }

  const files: Record<string, string> = {
    "/App.tsx": transformedCode,
    "/index.tsx": `import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Component to inject CSS synchronously
function StyleInjector() {
  useLayoutEffect(() => {
    // Add Tailwind CDN
    if (!document.getElementById("tailwind-cdn")) {
      const tailwindLink = document.createElement("link");
      tailwindLink.id = "tailwind-cdn";
      tailwindLink.rel = "stylesheet";
      tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css";
      document.head.appendChild(tailwindLink);
    }
    
    // Add Fragment UI styles
    if (!document.getElementById("fragment-ui-styles")) {
      const style = document.createElement("style");
      style.id = "fragment-ui-styles";
      style.textContent = ${JSON.stringify(bundledCSS || "")};
      document.head.appendChild(style);
    }
  }, []);
  
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <StyleInjector />
    <App />
  </React.StrictMode>
);`,
    "/package.json": JSON.stringify({
      name: "fragment-ui-playground",
      version: "1.0.0",
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
    }, null, 2),
  };

  // Add bundled UI as a local file
  if (bundledUI) {
    files["/fragment-ui.js"] = bundledUI;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[color:var(--color-fg-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Sandpack
        template="react-ts"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {},
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: false,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 0, // Hide editor
        }}
      />
    </div>
  );
}

