/**
 * Screen utilities for generators
 */

import type { UiScreenRegion } from "../types";

/**
 * Get CSS class name for region
 */
export function getRegionClassName(region: UiScreenRegion): string {
  const classes: Record<UiScreenRegion, string> = {
    header: 'border-b border-[color:var(--color-border-primary)] p-4',
    sidebar: 'border-r border-[color:var(--color-border-primary)] p-4 w-64',
    content: 'p-6 flex-1',
    footer: 'border-t border-[color:var(--color-border-primary)] p-4',
    main: 'p-6',
  };
  return classes[region] || 'p-4';
}

