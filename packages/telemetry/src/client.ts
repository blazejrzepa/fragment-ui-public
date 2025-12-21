import type {
  TelemetryEvent,
  TelemetryEventType,
  TelemetryConfig,
  TelemetryContext,
} from "./types";

/**
 * Client-side telemetry
 * Collects events in browser and sends them to server
 */
class TelemetryClient {
  private config: TelemetryConfig;
  private context: TelemetryContext = {};
  private eventQueue: TelemetryEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: Partial<TelemetryConfig> = {}) {
    this.config = {
      enabled: true,
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
      debug: false,
      ...config,
    };

    this.initializeContext();

    if (typeof window !== "undefined") {
      // Auto-flush periodically
      if (this.config.flushInterval) {
        this.flushTimer = setInterval(() => {
          this.flush();
        }, this.config.flushInterval);
      }

      // Flush on page unload
      window.addEventListener("beforeunload", () => {
        this.flush();
      });
    }
  }

  private initializeContext() {
    if (typeof window === "undefined") return;

    this.context = {
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: this.getOrCreateSessionId(),
    };
  }

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "";

    const storageKey = "fragment-ui-session-id";
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
  }

  /**
   * Track an event
   */
  track(
    type: TelemetryEventType,
    name: string,
    properties?: Record<string, any>
  ) {
    if (!this.config.enabled) return;

    const event: TelemetryEvent = {
      type,
      name,
      properties,
      timestamp: Date.now(),
      sessionId: this.context.sessionId,
      userId: this.context.userId,
    };

    this.eventQueue.push(event);

    if (this.config.debug) {
      console.log("[Telemetry] Event:", event);
    }

    // Flush if queue is full
    if (
      this.config.batchSize &&
      this.eventQueue.length >= this.config.batchSize
    ) {
      this.flush();
    }
  }

  /**
   * Update context
   */
  setContext(context: Partial<TelemetryContext>) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Set user ID
   */
  identify(userId: string) {
    this.context.userId = userId;
    if (typeof window !== "undefined") {
      localStorage.setItem("fragment-ui-user-id", userId);
    }
  }

  /**
   * Flush events to server
   */
  async flush() {
    if (this.eventQueue.length === 0) return;
    if (!this.config.enabled) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (this.config.endpoint) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events,
            context: this.context,
          }),
          keepalive: true, // Important for beforeunload
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (this.config.debug) {
          console.log(`[Telemetry] Flushed ${events.length} events`);
        }
      } catch (error) {
        // Only log errors in debug mode or if endpoint is explicitly configured
        if (this.config.debug) {
          console.error("[Telemetry] Failed to send events:", error);
        }
        // Silently fail in production - don't re-queue events to avoid memory issues
        // Re-queue only if explicitly enabled and debug mode
        if (this.config.debug && this.config.enabled) {
          this.eventQueue.unshift(...events);
        }
      }
    } else {
      // In development, just log
      if (this.config.debug) {
        console.log(`[Telemetry] Would send ${events.length} events:`, events);
      }
    }
  }

  /**
   * Convenience methods
   */
  pageView(page: string, properties?: Record<string, any>) {
    this.setContext({ page });
    this.track("page_view", page, properties);
  }

  componentInstall(component: string, properties?: Record<string, any>) {
    this.track("component_install", component, {
      component,
      ...properties,
    });
  }

  componentView(component: string, properties?: Record<string, any>) {
    this.track("component_view", component, {
      component,
      ...properties,
    });
  }

  versionSwitch(fromVersion: string, toVersion: string) {
    this.track("version_switch", "switch_version", {
      from: fromVersion,
      to: toVersion,
    });
  }

  searchQuery(query: string, results?: number) {
    this.track("search_query", "search", {
      query,
      results,
    });
  }

  linkClick(url: string, properties?: Record<string, any>) {
    this.track("link_click", "link_click", {
      url,
      ...properties,
    });
  }

  error(error: Error | string, properties?: Record<string, any>) {
    this.track("error", "error", {
      error: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" ? error.stack : undefined,
      ...properties,
    });
  }
}

// Singleton instance
let clientInstance: TelemetryClient | null = null;

/**
 * Initialize telemetry client
 */
export function initTelemetry(config: Partial<TelemetryConfig> = {}) {
  if (typeof window === "undefined") return null;

  clientInstance = new TelemetryClient(config);
  return clientInstance;
}

/**
 * Get telemetry client instance
 */
export function getTelemetryClient(): TelemetryClient | null {
  return clientInstance;
}

/**
 * Track event (convenience function)
 */
export function track(
  type: TelemetryEventType,
  name: string,
  properties?: Record<string, any>
) {
  const client = getTelemetryClient();
  if (client) {
    client.track(type, name, properties);
  }
}

export { TelemetryClient };
export type { TelemetryEvent, TelemetryConfig, TelemetryContext };

