/**
 * Fragment UI Telemetry
 * 
 * Usage:
 * 
 * Client-side:
 * ```ts
 * import { initTelemetry, track } from '@fragment_ui/telemetry/client';
 * 
 * initTelemetry({
 *   enabled: true,
 *   endpoint: '/api/telemetry',
 *   debug: true
 * });
 * 
 * track('page_view', 'home');
 * ```
 */

export * from "./types";
export * from "./client";
export * from "./component-usage";
export * from "./roi-metrics.js";
export * from "./github-integration.js";
// Database exports are server-only, import directly from "./db/database" in API routes
// export * from "./db/database.js";
// export * from "./db/schema.js";

