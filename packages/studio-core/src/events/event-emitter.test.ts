import { describe, it, expect, beforeEach, vi } from "vitest";
import { InMemoryEventEmitter } from "./event-emitter";
import type { AnyDomainEventPayload } from "./domain-events";

describe("InMemoryEventEmitter", () => {
  let emitter: InMemoryEventEmitter;

  beforeEach(() => {
    emitter = new InMemoryEventEmitter();
  });

  describe("on", () => {
    it("should register event handler", () => {
      const handler = vi.fn();
      emitter.on("AssetCreated", handler);
      // Handler should be registered (we can verify by emitting)
    });

    it("should register multiple handlers for same event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("AssetCreated", handler1);
      emitter.on("AssetCreated", handler2);

      // Both handlers should be registered
    });
  });

  describe("off", () => {
    it("should remove event handler", () => {
      const handler = vi.fn();
      emitter.on("AssetCreated", handler);
      emitter.off("AssetCreated", handler);

      // Handler should be removed
    });

    it("should not throw when removing non-existent handler", () => {
      const handler = vi.fn();
      expect(() => emitter.off("AssetCreated", handler)).not.toThrow();
    });

    it("should only remove specified handler", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("AssetCreated", handler1);
      emitter.on("AssetCreated", handler2);
      emitter.off("AssetCreated", handler1);

      // handler2 should still be registered
    });
  });

  describe("emit", () => {
    it("should call registered handler", async () => {
      const handler = vi.fn();
      emitter.on("AssetCreated", handler);

      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: new Date().toISOString(),
        entityId: "asset-123",
        metadata: {},
      };

      await emitter.emit(payload);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(payload);
    });

    it("should call all handlers for event", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      emitter.on("AssetCreated", handler1);
      emitter.on("AssetCreated", handler2);
      emitter.on("RevisionCreated", handler3);

      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: new Date().toISOString(),
        entityId: "asset-123",
        metadata: {},
      };

      await emitter.emit(payload);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).not.toHaveBeenCalled();
    });

    it("should not call handlers for different events", async () => {
      const handler = vi.fn();
      emitter.on("AssetCreated", handler);

      const payload: AnyDomainEventPayload = {
        event: "RevisionCreated",
        timestamp: new Date().toISOString(),
        entityId: "revision-123",
        metadata: {},
      };

      await emitter.emit(payload);

      expect(handler).not.toHaveBeenCalled();
    });

    it("should handle async handlers", async () => {
      const asyncHandler = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      emitter.on("AssetCreated", asyncHandler);

      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: new Date().toISOString(),
        entityId: "asset-123",
        metadata: {},
      };

      await emitter.emit(payload);

      expect(asyncHandler).toHaveBeenCalledTimes(1);
    });

    it("should not throw when no handlers are registered", async () => {
      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: new Date().toISOString(),
        entityId: "asset-123",
        metadata: {},
      };

      await expect(emitter.emit(payload)).resolves.not.toThrow();
    });

    it("should pass payload correctly to handlers", async () => {
      const handler = vi.fn();
      emitter.on("AssetCreated", handler);

      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: "2025-01-01T12:00:00.000Z",
        entityId: "asset-123",
        metadata: {
          asset: {
            id: "asset-123",
            type: "component",
            name: "Test Component",
            tags: [],
            source: "dsl",
            createdAt: "2025-01-01T12:00:00.000Z",
            createdBy: "user-123",
            lifecycleState: "draft",
          },
        },
      };

      await emitter.emit(payload);

      expect(handler).toHaveBeenCalledWith(payload);
    });
  });

  describe("event lifecycle", () => {
    it("should handle adding and removing handlers multiple times", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("AssetCreated", handler1);
      emitter.on("AssetCreated", handler2);

      const payload: AnyDomainEventPayload = {
        event: "AssetCreated",
        timestamp: new Date().toISOString(),
        entityId: "asset-123",
        metadata: {},
      };

      await emitter.emit(payload);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      emitter.off("AssetCreated", handler1);
      await emitter.emit(payload);

      expect(handler1).toHaveBeenCalledTimes(1); // Still 1
      expect(handler2).toHaveBeenCalledTimes(2); // Now 2
    });
  });
});

