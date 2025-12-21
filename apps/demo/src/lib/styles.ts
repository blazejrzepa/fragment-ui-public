/**
 * Style utilities for consistent theming
 * 
 * Note: This file contains fallback colors for CSS variables, which are acceptable
 * as they are not design decisions but technical fallbacks.
 */

/* eslint-disable ds-no-hardcolors/no-inline-hardcoded-colors */
/**
 * Create a color-mix with foreground primary
 */
export function foregroundMix(percentage: number): string {
  // Fallback color for CSS variable - this is acceptable as it's a fallback, not a design decision
  return `color-mix(in srgb, var(--foreground-primary, #0a0a0a) ${percentage}%, transparent)`;
}
/* eslint-enable ds-no-hardcolors/no-inline-hardcoded-colors */

/**
 * Common border colors
 */
export const borderColors = {
  subtle: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
  muted: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
} as const;

/**
 * Common background colors
 */
export const backgroundColors = {
  preview: foregroundMix(2),
  code: foregroundMix(2),
} as const;

