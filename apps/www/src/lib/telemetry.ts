/**
 * Telemetry stub - no-op implementation
 * 
 * Telemetry has been removed from the public portal.
 * This file provides a no-op implementation to maintain compatibility
 * with components that may still reference telemetry functions.
 */

// No-op telemetry client
const noOpClient = {
  pageView: () => {},
  versionSwitch: () => {},
  event: () => {},
  flush: () => Promise.resolve(),
};

export function getTelemetryClient() {
  return noOpClient;
}

export type TelemetryClient = typeof noOpClient;

