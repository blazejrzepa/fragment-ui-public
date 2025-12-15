"use client";

import * as React from "react";
import { Input } from "@fragment_ui/ui";
import clsx from "clsx";

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        <div
          className="w-8 h-8 rounded border border-[color:var(--color-border-base)]"
          style={{ backgroundColor: value }}
        />
      </label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={handleChange}
          className="w-16 h-10 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
        />
      </div>
      {description && (
        <p className="text-xs text-[color:var(--color-fg-muted)]">{description}</p>
      )}
    </div>
  );
}

