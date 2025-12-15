"use client";

import * as React from "react";
import { ComponentPreview } from "./ComponentPreview";
import { ComponentMetadata } from "./ComponentMetadata";
import { useComponentPreview } from "./hooks/useComponentPreview";
import type { EnhancedComponentInfo } from "./types";
import { CheckCircle2, ExternalLink } from "lucide-react";

export interface ComponentDocumentationProps {
  componentName: string;
  componentInfo?: Partial<EnhancedComponentInfo>;
  showInstall?: boolean;
  showExamples?: boolean;
  showCode?: boolean;
  showFeatures?: boolean;
  showAccessibility?: boolean;
  showLinks?: boolean;
  customInstallCommand?: string;
  storybookPath?: string;
  className?: string;
  CodeBlockComponent?: React.ComponentType<{ children: string; language?: string; className?: string }>;
}

/**
 * ComponentDocumentation - Full documentation page component
 * 
 * This component provides a complete documentation page layout for components,
 * including overview, install, examples, code, features, accessibility, and links.
 */
export function ComponentDocumentation({
  componentName,
  componentInfo,
  showInstall = true,
  showExamples = true,
  showCode = true,
  showFeatures = true,
  showAccessibility = true,
  showLinks = true,
  customInstallCommand,
  storybookPath,
  className = "",
  CodeBlockComponent,
}: ComponentDocumentationProps) {
  const { previewCode } = useComponentPreview({
    componentName,
    componentInfo,
  });

  const packageName = componentInfo?.package || "@fragment_ui/ui";
  const installCommand = customInstallCommand || `npx shadcn@latest add /r/${componentName.toLowerCase()}.json`;

  // Convert component name to PascalCase for imports
  const componentNamePascal = componentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // Generate import statement
  const importStatement = componentInfo?.import || componentNamePascal;

  // Generate example code
  const exampleCode = React.useMemo((): string => {
    if (componentInfo?.examples) {
      // If examples is an array
      if (Array.isArray(componentInfo.examples)) {
        const firstExample = componentInfo.examples[0];
        if (firstExample?.code && typeof firstExample.code === "string") {
          return firstExample.code;
        }
      }
      // If examples is an object with tsx
      if (typeof componentInfo.examples === "object" && "tsx" in componentInfo.examples) {
        const tsx = (componentInfo.examples as any).tsx;
        if (typeof tsx === "string") {
          return tsx;
        }
      }
    }
    
    // Fallback: generate basic code
    return `import { ${importStatement} } from "${packageName}";

<${componentNamePascal} />`;
  }, [componentInfo, importStatement, packageName, componentNamePascal]);

  return (
    <div className={`component-documentation ${className}`}>
      {/* Overview */}
      {componentInfo?.description && (
        <p
          className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
          style={{
            fontFamily: "Geist, sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            lineHeight: "160%",
            color: "var(--foreground-secondary)",
          }}
        >
          {componentInfo.description}
        </p>
      )}

      {/* Install */}
      {showInstall && (
        <>
          <h2 id="install">Install</h2>
          {CodeBlockComponent ? (
            <CodeBlockComponent language="bash">{installCommand}</CodeBlockComponent>
          ) : (
            <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm my-4">
              <code>{installCommand}</code>
            </pre>
          )}
        </>
      )}

      {/* Examples */}
      {showExamples && (
        <>
          <h2 id="examples">Examples</h2>
          <div className="space-y-4 my-6">
            {componentInfo?.examples && Array.isArray(componentInfo.examples) ? (
              // Multiple examples
              componentInfo.examples.map((example, idx) => (
                <div key={idx}>
                  {example.name && (
                    <h3 className="text-lg font-semibold mb-2">{example.name}</h3>
                  )}
                  {example.description && (
                    <p className="text-sm mb-2" style={{ color: "var(--foreground-secondary)" }}>
                      {example.description}
                    </p>
                  )}
                  <div className="border rounded-lg p-4 mb-4" style={{ backgroundColor: "var(--background-primary)" }}>
                    <ComponentPreview
                      componentName={componentName}
                      componentInfo={componentInfo}
                      previewCode={example.code || ""}
                      height="300px"
                    />
                  </div>
                </div>
              ))
            ) : (
              // Single example
              <div>
                <div className="border rounded-lg p-4 mb-4" style={{ backgroundColor: "var(--background-primary)" }}>
                  <ComponentPreview
                    componentName={componentName}
                    componentInfo={componentInfo}
                    previewCode={previewCode}
                    height="300px"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Code */}
      {showCode && (
        <>
          <h2 id="code">Code</h2>
          {CodeBlockComponent ? (
            <CodeBlockComponent language="typescript">{exampleCode}</CodeBlockComponent>
          ) : (
            <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm my-4">
              <code>{exampleCode}</code>
            </pre>
          )}
        </>
      )}

      {/* Features */}
      {showFeatures && componentInfo?.features && componentInfo.features.length > 0 && (
        <>
          <h2 id="features">Features</h2>
          <ul className="space-y-2 my-4">
            {componentInfo.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Accessibility */}
      {showAccessibility && componentInfo?.accessibility && (
        <>
          <h2 id="accessibility">Accessibility</h2>
          <div className="my-4 space-y-2">
            {componentInfo.accessibility.role && (
              <p>
                <strong>Role:</strong> <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--color-surface-2)" }}>{componentInfo.accessibility.role}</code>
              </p>
            )}
            {componentInfo.accessibility.notes && (
              <p>{componentInfo.accessibility.notes}</p>
            )}
            {componentInfo.accessibility.wcag && componentInfo.accessibility.wcag.length > 0 && (
              <p>
                <strong>WCAG Compliance:</strong> {componentInfo.accessibility.wcag.join(", ")}
              </p>
            )}
          </div>
        </>
      )}

      {/* Links */}
      {showLinks && (
        <>
          <h2 id="links">Links</h2>
          <ul className="space-y-2 my-4">
            {storybookPath && (
              <li>
                <a
                  href={storybookPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: "var(--color-brand-primary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View in Storybook
                </a>
              </li>
            )}
            {componentInfo?.related && componentInfo.related.length > 0 && (
              <>
                <li>
                  <strong>Related Components:</strong>
                </li>
                {componentInfo.related.map((related) => (
                  <li key={related} className="ml-4">
                    <a
                      href={`/docs/components/${related}`}
                      className="text-sm transition-colors"
                      style={{ color: "var(--color-brand-primary)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {related}
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

