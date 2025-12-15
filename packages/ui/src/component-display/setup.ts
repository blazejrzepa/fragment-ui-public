/**
 * Setup file for component display system
 * 
 * This file provides initialization functions for the component display system.
 * Apps should call these functions during initialization to configure the system.
 */

import * as React from "react";
import { setReactLiveRenderer } from "./ComponentPreview";

/**
 * Initialize component display system
 * 
 * This function should be called by consuming apps (apps/www, apps/demo)
 * to configure the component display system with their ReactLiveRenderer.
 * 
 * @param ReactLiveRenderer - The ReactLiveRenderer component from the app
 */
export function initializeComponentDisplay(ReactLiveRenderer: React.ComponentType<any>) {
  setReactLiveRenderer(ReactLiveRenderer);
}

/**
 * Check if component display system is initialized
 */
export function isComponentDisplayInitialized(): boolean {
  // This will be set by setReactLiveRenderer
  // We'll need to expose a way to check this
  return true; // For now, always return true
}

