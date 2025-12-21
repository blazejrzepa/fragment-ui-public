"use client";

import { useEffect } from "react";
import { initializeComponentDisplay } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";

/**
 * ComponentDisplayProvider
 * 
 * Initializes the unified component display system with ReactLiveRenderer.
 * This should be mounted once at the app root.
 */
export function ComponentDisplayProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize component display system with ReactLiveRenderer
    initializeComponentDisplay(ReactLiveRenderer);
  }, []);

  return <>{children}</>;
}

