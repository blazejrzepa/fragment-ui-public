import { describe, it, expect } from "vitest";
import { createAsset, type AssetType } from "./asset";

describe("createAsset", () => {
  it("should create an asset with required fields", () => {
    const asset = createAsset({
      type: "component",
      name: "Test Component",
      createdBy: "user-123",
    });

    expect(asset.id).toBeDefined();
    expect(asset.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(asset.type).toBe("component");
    expect(asset.name).toBe("Test Component");
    expect(asset.createdBy).toBe("user-123");
    expect(asset.tags).toEqual([]);
    expect(asset.source).toBe("dsl");
    expect(asset.lifecycleState).toBe("draft");
    expect(asset.createdAt).toBeDefined();
    expect(asset.metadata).toEqual({});
  });

  it("should create an asset with all optional fields", () => {
    const asset = createAsset({
      type: "screen",
      name: "Landing Page",
      description: "Main landing page",
      tags: ["landing", "home"],
      source: "figma",
      createdBy: "user-456",
      owner: "team-123",
      projectId: "project-789",
      orgId: "org-001",
    });

    expect(asset.description).toBe("Main landing page");
    expect(asset.tags).toEqual(["landing", "home"]);
    expect(asset.source).toBe("figma");
    expect(asset.owner).toBe("team-123");
    expect(asset.projectId).toBe("project-789");
    expect(asset.orgId).toBe("org-001");
  });

  it("should handle all asset types", () => {
    const types: AssetType[] = [
      "component",
      "block",
      "screen",
      "page",
      "flow",
      "tokenSet",
      "theme",
    ];

    types.forEach((type) => {
      const asset = createAsset({
        type,
        name: `Test ${type}`,
        createdBy: "user-123",
      });
      expect(asset.type).toBe(type);
    });
  });

  it("should use default values when optional fields are not provided", () => {
    const asset = createAsset({
      type: "block",
      name: "Test Block",
      createdBy: "user-123",
    });

    expect(asset.tags).toEqual([]);
    expect(asset.source).toBe("dsl");
    expect(asset.lifecycleState).toBe("draft");
    expect(asset.metadata).toEqual({});
    expect(asset.updatedAt).toBeUndefined();
  });

  it("should generate valid ISO 8601 timestamp", () => {
    const asset = createAsset({
      type: "component",
      name: "Test",
      createdBy: "user-123",
    });

    expect(asset.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
    expect(() => new Date(asset.createdAt)).not.toThrow();
  });
});

