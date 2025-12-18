"use client";

/**
 * Telemetry Provider - no-op implementation
 * 
 * Telemetry has been removed from the public portal.
 * This component is kept for compatibility but does nothing.
 */
export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

