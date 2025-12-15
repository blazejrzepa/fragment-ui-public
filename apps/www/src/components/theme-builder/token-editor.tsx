"use client";

import * as React from "react";
import { Input } from "@fragment_ui/ui";
import { ColorPicker } from "./color-picker";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export type TokenValue = string | number;

export interface TokenDefinition {
  path: string; // e.g., "color.brand.primary"
  label: string;
  type: "color" | "number" | "string";
  unit?: string; // e.g., "px", "ms"
  description?: string;
}

export interface TokenEditorProps {
  tokens: TokenDefinition[];
  values: Record<string, TokenValue>;
  onChange: (path: string, value: TokenValue) => void;
  onReset?: () => void;
}

export function TokenEditor({ tokens, values, onChange, onReset }: TokenEditorProps) {
  const handleChange = (path: string, value: TokenValue) => {
    onChange(path, value);
  };

  const groupedTokens = React.useMemo(() => {
    const groups: Record<string, TokenDefinition[]> = {};
    tokens.forEach((token) => {
      const category = token.path.split(".")[0];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(token);
    });
    return groups;
  }, [tokens]);

  return (
    <div className="space-y-6">
      {onReset && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset to Default
          </Button>
        </div>
      )}
      {Object.entries(groupedTokens).map(([category, categoryTokens]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{category}</h3>
          <div className="space-y-4 pl-4 border-l-2 border-[color:var(--color-border-base)]">
            {categoryTokens.map((token) => {
              const currentValue = values[token.path] ?? "";

              if (token.type === "color") {
                return (
                  <ColorPicker
                    key={token.path}
                    label={token.label}
                    value={String(currentValue)}
                    onChange={(value) => handleChange(token.path, value)}
                    description={token.description}
                  />
                );
              }

              return (
                <div key={token.path} className="space-y-2">
                  <label className="text-sm font-medium">{token.label}</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type={token.type === "number" ? "number" : "text"}
                      value={currentValue}
                      onChange={(e) => {
                        const value =
                          token.type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                        handleChange(token.path, value);
                      }}
                      placeholder={token.description}
                      className="flex-1 font-mono text-sm"
                    />
                    {token.unit && (
                      <span className="text-sm text-[color:var(--color-fg-muted)]">
                        {token.unit}
                      </span>
                    )}
                  </div>
                  {token.description && (
                    <p className="text-xs text-[color:var(--color-fg-muted)]">
                      {token.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

