/**
 * Event emitter interface for domain events
 */

import type { AnyDomainEventPayload } from "./domain-events";

export type EventHandler = (payload: AnyDomainEventPayload) => void | Promise<void>;

export interface EventEmitter {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(payload: AnyDomainEventPayload): void | Promise<void>;
}

// Simple in-memory implementation (can be replaced with event bus later)
export class InMemoryEventEmitter implements EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  async emit(payload: AnyDomainEventPayload): Promise<void> {
    const handlers = this.handlers.get(payload.event) || new Set();
    await Promise.all(Array.from(handlers).map(handler => handler(payload)));
  }
}

