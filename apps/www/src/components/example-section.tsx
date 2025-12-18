"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CodeBlock, DocumentContent, SegmentedControl, Button } from "@fragment_ui/ui";
import { Copy, Check } from "lucide-react";

// Constants
const SEGMENTED_CONTROL_CLASSES = "[&>button]:py-[var(--space-2)] [&>button]:px-[var(--space-3)] [&>button]:text-[length:var(--typography-size-md)] [&>button]:font-semibold [&>button[data-state=on]]:bg-[color:var(--color-surface-1)] [&>button[data-state=on]]:text-[color:var(--color-fg-base)] [&>button[data-state=on]]:shadow-sm [&>button[data-state=on]]:ring-1 [&>button[data-state=on]]:ring-[color:var(--color-border-base)] [&>button[data-state=on]]:ring-inset [&>button:not([data-state=on])]:text-[color:var(--color-fg-muted)]";

const DEFAULT_PREVIEW_HEIGHT = 360;
const PREVIEW_CONTAINER_BASE_CLASSES = "preview flex w-full justify-center items-center p-[var(--space-8)] border border-[color:var(--color-border-base)] rounded-lg overflow-auto";
const CODE_CONTAINER_CLASSES = "overflow-auto h-[360px] rounded-lg";

// Custom hook for copy functionality
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [text]);

  return { copied, handleCopy };
}

// Example section component to reduce duplication
export interface ExampleSectionProps {
  id: string;
  title: string;
  code: string;
  children: React.ReactNode;
  previewHeight?: string;
  marginTop?: string;
  maxWidth?: string;
}

export function ExampleSection({ id, title, code, children, previewHeight, marginTop = "mt-4", maxWidth = "max-w-md" }: ExampleSectionProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { copied, handleCopy } = useCopy(code);

  // Measure content height and adjust preview height if needed
  useEffect(() => {
    if (view !== "preview" || !contentRef.current) return;

    const measureHeight = () => {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      // Get the actual content height
      const contentHeight = contentElement.scrollHeight;
      // Add padding (p-8 = 32px top + 32px bottom = 64px)
      const totalHeight = contentHeight + 64;

      // If content is taller than default, use measured height with some buffer
      if (totalHeight > DEFAULT_PREVIEW_HEIGHT) {
        setDynamicHeight(Math.max(totalHeight, DEFAULT_PREVIEW_HEIGHT));
      } else {
        setDynamicHeight(null);
      }
    };

    // Measure after initial render
    measureHeight();

    // Use ResizeObserver to handle dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      measureHeight();
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [view, children]);

  // Use provided previewHeight or dynamic height, fallback to default
  const finalHeight = previewHeight 
    ? previewHeight 
    : dynamicHeight 
      ? `${dynamicHeight}px` 
      : `${DEFAULT_PREVIEW_HEIGHT}px`;

  const previewContainerClasses = `${PREVIEW_CONTAINER_BASE_CLASSES} ${view === "preview" ? "" : "hidden"}`;

  return (
    <div className={`group relative ${marginTop} mb-0 flex flex-col gap-0 rounded-lg`}>
      <div className="flex items-center justify-between">
        <h2 id={id} className="m-0">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="h-[var(--space-8)] w-[var(--space-8)] p-[var(--space-0)]"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <SegmentedControl
            value={view}
            onChange={(value) => setView(value as "preview" | "code")}
            options={[
              { value: "preview", label: "Preview" },
              { value: "code", label: "Code" },
            ]}
            size="sm"
            className={SEGMENTED_CONTROL_CLASSES}
          />
        </div>
      </div>
      
      <div className="relative mt-3">
        <div 
          className={previewContainerClasses}
          style={{ height: view === "preview" ? finalHeight : undefined }}
        >
          <div 
            ref={contentRef}
            className={`w-full ${maxWidth}`} 
            suppressHydrationWarning
          >
            {children}
          </div>
        </div>
        <div className={view === "code" ? CODE_CONTAINER_CLASSES : "hidden"}>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showCopyButton={false} className="h-full">
            {code}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}

