"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLiveRenderer } from "./react-live-renderer";

/**
 * StackBlitzRenderer - Render code using StackBlitz WebContainers
 * 
 * Advantages over Sandpack:
 * - Works in same origin (no CORS issues)
 * - CSS injection should work properly
 * - Faster boot time
 * - Better debugging
 */
interface StackBlitzRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

export function StackBlitzRenderer({ code, onError }: StackBlitzRendererProps) {
  const [bundledUI, setBundledUI] = useState<string | null>(null);
  const [bundledCSS, setBundledCSS] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const embeddedRef = useRef<boolean>(false);

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

        console.log("✅ Loaded bundled assets for StackBlitz:", {
          jsSize: bundled.length,
          cssSize: css.length,
        });

        setBundledUI(bundled);
        setBundledCSS(css);
      } catch (error) {
        console.error("❌ Failed to load bundled assets:", error);
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

  // Embed StackBlitz project when assets are loaded
  useEffect(() => {
    if (loading || !containerRef.current || embeddedRef.current) return;

    // Check if SharedArrayBuffer is available (required for WebContainers)
    if (typeof SharedArrayBuffer === "undefined") {
      console.warn(
        "⚠️ SharedArrayBuffer is not available. StackBlitz WebContainers require COOP/COEP headers and HTTPS. Falling back to React Live."
      );
      // Don't return - we'll use React Live as fallback
      return;
    }

    // Use dynamic import to avoid Next.js bundling issues
    const embedProject = async () => {
      try {
        const StackBlitzSDK = await import("@stackblitz/sdk");
        const sdk = StackBlitzSDK.default || StackBlitzSDK;
        
        if (!sdk || !sdk.embedProject) {
          throw new Error("StackBlitzSDK.embedProject is not available");
        }

        const files: Record<string, string> = {
          "src/App.tsx": transformedCode,
          "src/index.tsx": `
import React from "react";
import ReactDOM from "react-dom/client";
${bundledCSS ? "import './styles.css';" : ""}
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
          `.trim(),
          "public/index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fragment UI Playground</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
          `.trim(),
          "package.json": JSON.stringify(
            {
              name: "fragment-ui-playground",
              version: "1.0.0",
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
              },
            },
            null,
            2
          ),
        };

        // Add CSS if available
        if (bundledCSS) {
          files["src/styles.css"] = bundledCSS;
        }

        // Add bundled UI as local module
        if (bundledUI) {
          files["src/fragment-ui.js"] = bundledUI;
        }

        console.log("🚀 Embedding StackBlitz project...", {
          hasCSS: !!bundledCSS,
          hasUI: !!bundledUI,
          codeLength: transformedCode.length,
        });

        // Use embedProject with timeout handling
        if (!containerRef.current) {
          throw new Error("Container ref is not available");
        }
        // @ts-ignore - StackBlitz SDK types may not match actual API
        const vmPromise = sdk.embedProject(containerRef.current, {
          title: "Fragment UI Playground",
          description: "Generated component with Fragment UI Design System",
          template: "create-react-app",
          files,
        } as any);

        // Add timeout to detect connection issues
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("Timeout: Unable to establish connection with StackBlitz VM. This may be due to missing COOP/COEP headers or SharedArrayBuffer not being available."));
          }, 30000); // 30 second timeout
        });

        await Promise.race([vmPromise, timeoutPromise]);

        console.log("✅ StackBlitz project embedded successfully");
        embeddedRef.current = true;
      } catch (error) {
        console.error("❌ Failed to embed StackBlitz project:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    embedProject();
  }, [loading, transformedCode, bundledUI, bundledCSS, onError]);

  // Fallback to React Live if SharedArrayBuffer is not available
  if (typeof SharedArrayBuffer === "undefined") {
    console.log("🔄 Using React Live as fallback (SharedArrayBuffer not available)");
    return <ReactLiveRenderer code={code} onError={onError} />;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Loading StackBlitz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
      }}
    />
  );
}

/**
 * StackBlitzPreview - Preview only (no editor)
 */
interface StackBlitzPreviewProps {
  code: string;
  onError?: (error: Error) => void;
}

export function StackBlitzPreview({ code, onError }: StackBlitzPreviewProps) {
  return <StackBlitzRenderer code={code} onError={onError} />;
}

