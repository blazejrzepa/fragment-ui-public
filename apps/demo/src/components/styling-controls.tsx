"use client";

/**
 * Styling Controls - Toggles for theme, density, motion, and contrast
 */

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import { 
  applyDensity, 
  applyMotion, 
  applyContrast,
  getInitialDensity,
  getInitialMotion,
  getInitialContrast,
  type Density,
  type Motion,
  type Contrast,
} from "../lib/styling";
import { useTheme } from "../lib/theme";
import { Sun, Moon, Contrast as ContrastIcon, Gauge, Zap } from "lucide-react";

export function StylingControls() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [density, setDensity] = React.useState<Density>(getInitialDensity);
  const [motion, setMotion] = React.useState<Motion>(getInitialMotion);
  const [contrast, setContrast] = React.useState<Contrast>(getInitialContrast);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleDensityChange = (newDensity: Density) => {
    setDensity(newDensity);
    applyDensity(newDensity);
  };

  const handleMotionChange = (newMotion: Motion) => {
    setMotion(newMotion);
    applyMotion(newMotion);
  };

  const handleContrastChange = (newContrast: Contrast) => {
    setContrast(newContrast);
    applyContrast(newContrast);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-[color:var(--color-surface-1)]">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (effectiveTheme === "dark") {
            setTheme("light");
          } else if (effectiveTheme === "light") {
            setTheme("high-contrast");
          } else {
            setTheme("dark");
          }
        }}
        title={`Theme: ${effectiveTheme}`}
        className="h-8 w-8 p-0"
        data-action-id="theme-toggle"
        data-action-kind="toggle"
      >
        {effectiveTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : effectiveTheme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <ContrastIcon className="h-4 w-4" />
        )}
      </Button>

      {/* Density Toggle */}
      <div className="flex items-center gap-1 border-l pl-2">
        <Gauge className="h-4 w-4 text-[color:var(--foreground-secondary)]" />
        <div className="flex gap-1">
          {(["compact", "normal", "comfortable"] as Density[]).map((d) => (
            <Button
              key={d}
              variant={density === d ? "solid" : "ghost"}
              size="sm"
              onClick={() => handleDensityChange(d)}
              className="h-7 px-2 text-xs capitalize"
              data-action-id={`density-${d}`}
              data-action-kind="select"
            >
              {d.charAt(0)}
            </Button>
          ))}
        </div>
      </div>

      {/* Motion Toggle */}
      <div className="flex items-center gap-1 border-l pl-2">
        <Zap className="h-4 w-4 text-[color:var(--foreground-secondary)]" />
        <div className="flex gap-1">
          {(["reduced", "normal"] as Motion[]).map((m) => (
            <Button
              key={m}
              variant={motion === m ? "solid" : "ghost"}
              size="sm"
              onClick={() => handleMotionChange(m)}
              className="h-7 px-2 text-xs capitalize"
              data-action-id={`motion-${m}`}
              data-action-kind="select"
            >
              {m === "reduced" ? "Off" : "On"}
            </Button>
          ))}
        </div>
      </div>

      {/* Contrast Toggle */}
      <div className="flex items-center gap-1 border-l pl-2">
        <ContrastIcon className="h-4 w-4 text-[color:var(--foreground-secondary)]" />
        <div className="flex gap-1">
          {(["normal", "high"] as Contrast[]).map((c) => (
            <Button
              key={c}
              variant={contrast === c ? "solid" : "ghost"}
              size="sm"
              onClick={() => handleContrastChange(c)}
              className="h-7 px-2 text-xs capitalize"
              data-action-id={`contrast-${c}`}
              data-action-kind="select"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

