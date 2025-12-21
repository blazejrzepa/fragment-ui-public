"use client";

import * as React from "react";

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

// Predefined color shades for brand primary
const PREDEFINED_COLORS = [
  "#6366F1", // Indigo (default)
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
];

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePredefinedClick = (color: string) => {
    onChange(color);
  };

  return (
    <div className="flex items-center gap-[var(--space-3)]">
      <div className="relative w-8 h-8 flex-shrink-0">
        <input
          type="color"
          value={value}
          onChange={handleChange}
          className="w-full h-full p-0 cursor-pointer rounded-full border-2 border-[color:var(--color-border-base)] overflow-hidden"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            backgroundColor: value,
            background: value,
          }}
        />
      </div>
      <div className="flex items-center gap-[var(--space-2)] flex-wrap">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePredefinedClick(color)}
            className="w-6 h-6 rounded-full border-2 border-[color:var(--color-border-base)] cursor-pointer hover:scale-110 transition-transform"
            style={{
              backgroundColor: color,
              background: color,
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

