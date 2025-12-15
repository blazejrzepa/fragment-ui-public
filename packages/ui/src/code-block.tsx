"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./button";

export interface CodeBlockProps {
  /**
   * Code content to display
   */
  children: string;
  /**
   * Programming language for syntax highlighting
   * @default "typescript"
   */
  language?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show copy button
   * @default true
   */
  showCopyButton?: boolean;
  /**
   * API URL for syntax highlighting (e.g., "/api/highlight-code" for Next.js)
   * If not provided, code will be displayed without highlighting
   */
  highlightApiUrl?: string;
  /**
   * Theme for code display (used when highlightApiUrl is not provided)
   */
  theme?: "light" | "dark" | "auto";
  /**
   * Show line numbers
   * @default true
   */
  showLineNumbers?: boolean;
}

/**
 * CodeBlock component that renders code with optional syntax highlighting
 * 
 * @example
 * ```tsx
 * <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
 *   {`const hello = "world";`}
 * </CodeBlock>
 * ```
 */
export function CodeBlock({
  children,
  language = "typescript",
  className = "",
  showCopyButton = true,
  highlightApiUrl,
  theme = "auto",
  showLineNumbers = true,
}: CodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLPreElement>(null);
  const codeWrapperRef = React.useRef<HTMLDivElement>(null);

  // Fetch syntax highlighting
  React.useEffect(() => {
    if (!highlightApiUrl) {
      setIsLoading(false);
      return;
    }

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(highlightApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: children.trim(),
            language,
            showLineNumbers,
          }),
        });

        if (response.ok) {
          try {
            const data = await response.json();
            if (data.html) {
              setHighlightedHtml(data.html);
            } else if (data.error) {
              console.error("Code highlighting API error:", data.error);
            } else {
              console.error("Code highlighting API returned invalid response");
            }
          } catch (jsonError) {
            console.error("Failed to parse highlight response:", jsonError);
          }
        } else {
          try {
            const errorData = await response.json().catch(() => null);
            console.error("Failed to highlight code:", response.status, errorData?.error || response.statusText);
          } catch {
            console.error("Failed to highlight code:", response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error("Code highlighting error:", error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [children, language, highlightApiUrl]);

  // Copy to clipboard
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [children]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative not-prose ${className}`}>
        {showCopyButton && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        <pre
          ref={codeRef}
          className="bg-[color:var(--color-surface-1)] rounded-lg overflow-x-auto border border-[color:var(--color-border-base)]"
          style={{
            fontFamily: "'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
            fontSize: "0.875rem",
            lineHeight: "1.7",
            fontWeight: 300,
            marginTop: "0",
            marginBottom: "0",
            padding: "1rem 1.25rem",
            backgroundColor: "var(--color-surface-1)",
            borderColor: "var(--color-border-base)",
          }}
        >
          <code>
            {children.trim()}
          </code>
        </pre>
      </div>
    );
  }

  // Highlighted code
  if (highlightedHtml) {
    // Shiki returns <pre><code>...</code></pre> with its own styling
    // We wrap it in a div for copy button positioning and margins
    // Shiki's output will be styled by CSS in styles.css

    return (
      <div className={`relative not-prose ${className}`} style={{ marginTop: "0", marginBottom: "0" }}>
        {showCopyButton && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <div
          ref={codeWrapperRef}
          className="not-prose"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    );
  }

  // Plain code (no highlighting)
  return (
    <pre
      ref={codeRef}
      className={`relative not-prose bg-[color:var(--color-surface-1)] rounded-lg overflow-x-auto border border-[color:var(--color-border-base)] ${className}`}
      style={{
        fontFamily: "'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
        fontSize: "0.875rem",
        lineHeight: "1.7",
            fontWeight: 300,
        padding: "1rem 1.25rem",
        marginTop: "0",
        marginBottom: "0",
        backgroundColor: "var(--color-surface-1)",
        borderColor: "var(--color-border-base)",
      }}
    >
      {showCopyButton && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      )}
      <code>
        {children.trim()}
      </code>
    </pre>
  );
}

