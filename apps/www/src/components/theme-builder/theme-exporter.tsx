"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import { TokenValue } from "./token-editor";

export interface ThemeExporterProps {
  tokens: Record<string, TokenValue>;
  format?: "json" | "css";
}

export function ThemeExporter({ tokens, format = "json" }: ThemeExporterProps) {
  const [copied, setCopied] = React.useState(false);

  const exportCode = React.useMemo(() => {
    if (format === "css") {
      const cssVars = Object.entries(tokens)
        .map(([path, value]) => {
          const varName = `--${path.replace(/\./g, "-")}`;
          return `  ${varName}: ${value};`;
        })
        .join("\n");
      return `:root {\n${cssVars}\n}`;
    }

    // JSON format - reconstruct nested structure
    const nested: Record<string, any> = {};
    Object.entries(tokens).forEach(([path, value]) => {
      const parts = path.split(".");
      let current = nested;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    });
    return JSON.stringify(nested, null, 2);
  }, [tokens, format]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportCode], {
      type: format === "json" ? "application/json" : "text/css",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme.${format === "json" ? "json" : "css"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Export as {format.toUpperCase()}
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
        <code>{exportCode}</code>
      </pre>
    </div>
  );
}

