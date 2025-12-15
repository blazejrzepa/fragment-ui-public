"use client";

import * as React from "react";
import { HexColorPicker, RgbColorPicker, HslColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import clsx from "clsx";

type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  format?: ColorFormat;
  showPresets?: boolean;
  presets?: string[];
  showAlpha?: boolean;
  className?: string;
  disabled?: boolean;
}

const defaultPresets = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#808080",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#000080",
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r = 0;
  let g = 0;
  let b = 0;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    {
      value = "#000000",
      onChange,
      format = "hex",
      showPresets = true,
      presets = defaultPresets,
      showAlpha = false,
      className,
      disabled,
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);
    const [colorValue, setColorValue] = React.useState(value);
    const [hexInput, setHexInput] = React.useState(value);
    const [rgbInput, setRgbInput] = React.useState(() => {
      const rgb = hexToRgb(value);
      return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "0, 0, 0";
    });
    const [hslInput, setHslInput] = React.useState(() => {
      const hsl = hexToHsl(value);
      return hsl ? `${hsl.h}, ${hsl.s}%, ${hsl.l}%` : "0, 0%, 0%";
    });

    React.useEffect(() => {
      setColorValue(value);
      setHexInput(value);
      const rgb = hexToRgb(value);
      if (rgb) {
        setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
      const hsl = hexToHsl(value);
      if (hsl) {
        setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
      }
    }, [value]);

    const handleHexChange = React.useCallback((hex: string) => {
      setColorValue(hex);
      setHexInput(hex);
      const rgb = hexToRgb(hex);
      if (rgb) {
        setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
      const hsl = hexToHsl(hex);
      if (hsl) {
        setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
      }
      onChange?.(hex);
    }, [onChange]);

    const handleRgbChange = React.useCallback((rgb: { r: number; g: number; b: number; a?: number }) => {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColorValue(hex);
      setHexInput(hex);
      setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      const hsl = hexToHsl(hex);
      if (hsl) {
        setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
      }
      onChange?.(hex);
    }, [onChange]);

    const handleHslChange = React.useCallback((hsl: { h: number; s: number; l: number; a?: number }) => {
      const hex = hslToHex(hsl.h, hsl.s, hsl.l);
      setColorValue(hex);
      setHexInput(hex);
      const rgb = hexToRgb(hex);
      if (rgb) {
        setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
      setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
      onChange?.(hex);
    }, [onChange]);

    const handleHexInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newHex = e.target.value;
      setHexInput(newHex);
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newHex)) {
        handleHexChange(newHex);
      }
    }, [handleHexChange]);

    const handleRgbInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newRgb = e.target.value;
      setRgbInput(newRgb);
      const match = newRgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          handleRgbChange({ r, g, b });
        }
      }
    }, [handleRgbChange]);

    const handleHslInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newHsl = e.target.value;
      setHslInput(newHsl);
      const match = newHsl.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
      if (match) {
        const h = parseInt(match[1], 10);
        const s = parseInt(match[2], 10);
        const l = parseInt(match[3], 10);
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
          handleHslChange({ h, s, l });
        }
      }
    }, [handleHslChange]);

    const rgb = React.useMemo(() => hexToRgb(colorValue) || { r: 0, g: 0, b: 0 }, [colorValue]);
    const hsl = React.useMemo(() => hexToHsl(colorValue) || { h: 0, s: 0, l: 0 }, [colorValue]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={clsx("w-full justify-start gap-2", className)}
            disabled={disabled}
          >
            <div
              className="w-4 h-4 rounded border border-[color:var(--color-border)]"
              style={{ backgroundColor: colorValue }}
            />
            <span>{colorValue.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {format === "hex" && (
                <HexColorPicker
                  color={colorValue}
                  onChange={handleHexChange}
                  style={{ width: "200px", height: "200px" }}
                />
              )}
              {format === "rgb" && (
                <RgbColorPicker
                  color={rgb}
                  onChange={handleRgbChange}
                  style={{ width: "200px", height: "200px" }}
                />
              )}
              {format === "hsl" && (
                <HslColorPicker
                  color={hsl}
                  onChange={handleHslChange}
                  style={{ width: "200px", height: "200px" }}
                />
              )}
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-[color:var(--color-fg-muted)] mb-1 block">
                  HEX
                </label>
                <Input
                  value={hexInput}
                  onChange={handleHexInputChange}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[color:var(--color-fg-muted)] mb-1 block">
                  RGB
                </label>
                <Input
                  value={rgbInput}
                  onChange={handleRgbInputChange}
                  placeholder="0, 0, 0"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[color:var(--color-fg-muted)] mb-1 block">
                  HSL
                </label>
                <Input
                  value={hslInput}
                  onChange={handleHslInputChange}
                  placeholder="0, 0%, 0%"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {showPresets && presets.length > 0 && (
              <div>
                <label className="text-xs text-[color:var(--color-fg-muted)] mb-2 block">
                  Presets
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleHexChange(preset)}
                      className={clsx(
                        "w-8 h-8 rounded border-2 transition-all",
                        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand",
                        colorValue.toLowerCase() === preset.toLowerCase()
                          ? "border-brand ring-2 ring-brand"
                          : "border-[color:var(--color-border)]"
                      )}
                      style={{ backgroundColor: preset }}
                      aria-label={`Select color ${preset}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

