"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fragment_ui/ui";
import { ChevronDown } from "lucide-react";

/**
 * Available spacing tokens from tokens.json
 */
const SPACING_TOKENS = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "6": 24,
  "8": 32,
} as const;

/**
 * Available radius tokens from tokens.json
 */
const RADIUS_TOKENS = {
  "sm": 8,
  "md": 12,
  "lg": 16,
  "xl": 24,
} as const;

interface TokenPickerProps {
  tokenType: "space" | "radius";
  value?: string | number;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Token Picker component for selecting spacing or radius tokens
 */
export function TokenPicker({ tokenType, value, onChange, label }: TokenPickerProps) {
  const tokens = tokenType === "space" ? SPACING_TOKENS : RADIUS_TOKENS;
  const tokenEntries = Object.entries(tokens);

  // Convert value to string for display
  const displayValue = value !== undefined ? String(value) : "";

  // Find current token key from value
  const currentTokenKey = tokenEntries.find(([_, tokenValue]) => {
    if (typeof value === "number") {
      return tokenValue === value;
    }
    return String(tokenValue) === String(value);
  })?.[0] || displayValue;

  return (
    <div>
      {/* Global styles for SelectTrigger when open */}
      <style dangerouslySetInnerHTML={{__html: `
        [data-state="open"] {
          border-color: color-mix(in srgb, var(--foreground-primary) 5%, transparent) !important;
        }
      `}} />
      {label && (
        <label className="text-xs text-[color:var(--foreground-secondary)] block mb-1">
          {label}
        </label>
      )}
      <Select value={currentTokenKey} onValueChange={onChange}>
        <SelectTrigger 
          className="h-8 text-xs"
          style={{
            borderRadius: "8px",
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
          }}
        >
          <SelectValue />
          <ChevronDown className="w-4 h-4 opacity-50" style={{ color: "var(--foreground-secondary)" }} />
        </SelectTrigger>
        <SelectContent 
          position="popper"
          sideOffset={4}
          align="start"
          className="!w-[var(--radix-select-trigger-width)]"
          style={{
            borderRadius: "8px",
            width: 'var(--radix-select-trigger-width)',
            minWidth: 'var(--radix-select-trigger-width)',
            maxWidth: 'var(--radix-select-trigger-width)',
          }}
        >
          {tokenEntries.map(([key, tokenValue]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center justify-between w-full">
                <span>{key}</span>
                <span className="text-xs text-[color:var(--foreground-tertiary)] ml-2">
                  {tokenValue}px
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

