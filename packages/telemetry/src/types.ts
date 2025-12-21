/**
 * Telemetry event types
 */
export type TelemetryEventType =
  | "page_view"
  | "component_install"
  | "component_view"
  | "version_switch"
  | "search_query"
  | "link_click"
  | "error"
  | "custom";

export interface TelemetryEvent {
  type: TelemetryEventType;
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface TelemetryConfig {
  enabled: boolean;
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  debug?: boolean;
}

export interface TelemetryContext {
  page?: string;
  version?: string;
  userAgent?: string;
  referrer?: string;
  userId?: string;
  sessionId?: string;
}

