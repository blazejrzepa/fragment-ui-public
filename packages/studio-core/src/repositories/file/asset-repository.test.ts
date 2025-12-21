import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { FileAssetRepository } from "./asset-repository";
import { createAsset } from "../../entities/asset";

// Test helper: Create a temporary directory for each test
async function createTempDir(): Promise<string> {
  const tempDir = join(
    tmpdir(),
    `studio-core-test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  );
  await fs.mkdir(tempDir, { recursive: true });
  return tempDir;
}

describe("FileAssetRepository", () => {
  let repository: FileAssetRepository;
  let tempDir: string;
  let originalProcessCwd: typeof process.cwd;

  beforeEach(async () => {
    tempDir = await createTempDir();
    // Mock process.cwd to return temp directory
    originalProcessCwd = process.cwd;
    Object.defineProperty(process, "cwd", {
      value: () => tempDir,
      writable: true,
      configurable: true,
    });

    repository = new FileAssetRepository();
  });

  afterEach(async () => {
    // Restore original process.cwd
    Object.defineProperty(process, "cwd", {
      value: originalProcessCwd,
      writable: true,
      configurable: true,
    });

    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("create", () => {
    it("should create an asset and store it", async () => {
      const asset = createAsset({
        type: "component",
        name: "Test Component",
        createdBy: "user-123",
      });

      const created = await repository.create(asset);
      expect(created).toEqual(asset);

      const found = await repository.findById(asset.id);
      expect(found).toEqual(asset);
    });

    it("should create multiple assets", async () => {
      const asset1 = createAsset({
        type: "component",
        name: "Component 1",
        createdBy: "user-123",
      });

      const asset2 = createAsset({
        type: "screen",
        name: "Screen 1",
        createdBy: "user-123",
      });

      await repository.create(asset1);
      await repository.create(asset2);

      const found1 = await repository.findById(asset1.id);
      const found2 = await repository.findById(asset2.id);

      expect(found1).toEqual(asset1);
      expect(found2).toEqual(asset2);
    });
  });

  describe("findById", () => {
    it("should return null for non-existent asset", async () => {
      const found = await repository.findById("non-existent-id");
      expect(found).toBeNull();
    });

    it("should find asset by id", async () => {
      const asset = createAsset({
        type: "component",
        name: "Test Component",
        createdBy: "user-123",
      });

      await repository.create(asset);
      const found = await repository.findById(asset.id);

      expect(found).toEqual(asset);
    });
  });

  describe("findByType", () => {
    it("should return empty array when no assets exist", async () => {
      const found = await repository.findByType("component");
      expect(found).toEqual([]);
    });

    it("should find assets by type", async () => {
      const component1 = createAsset({
        type: "component",
        name: "Component 1",
        createdBy: "user-123",
      });

      const component2 = createAsset({
        type: "component",
        name: "Component 2",
        createdBy: "user-123",
      });

      const screen = createAsset({
        type: "screen",
        name: "Screen 1",
        createdBy: "user-123",
      });

      await repository.create(component1);
      await repository.create(component2);
      await repository.create(screen);

      const components = await repository.findByType("component");
      expect(components).toHaveLength(2);
      expect(components.map((a) => a.id).sort()).toEqual(
        [component1.id, component2.id].sort()
      );

      const screens = await repository.findByType("screen");
      expect(screens).toHaveLength(1);
      expect(screens[0].id).toBe(screen.id);
    });
  });

  describe("findByProject", () => {
    it("should return empty array when no assets exist", async () => {
      const found = await repository.findByProject("project-123");
      expect(found).toEqual([]);
    });

    it("should find assets by project", async () => {
      const asset1 = createAsset({
        type: "component",
        name: "Component 1",
        createdBy: "user-123",
        projectId: "project-123",
      });

      const asset2 = createAsset({
        type: "screen",
        name: "Screen 1",
        createdBy: "user-123",
        projectId: "project-123",
      });

      const asset3 = createAsset({
        type: "component",
        name: "Component 2",
        createdBy: "user-123",
        projectId: "project-456",
      });

      await repository.create(asset1);
      await repository.create(asset2);
      await repository.create(asset3);

      const projectAssets = await repository.findByProject("project-123");
      expect(projectAssets).toHaveLength(2);
      expect(projectAssets.map((a) => a.id).sort()).toEqual(
        [asset1.id, asset2.id].sort()
      );
    });
  });

  describe("update", () => {
    it("should throw error for non-existent asset", async () => {
      await expect(
        repository.update("non-existent-id", { name: "Updated" })
      ).rejects.toThrow("Asset non-existent-id not found");
    });

    it("should update asset fields", async () => {
      const asset = createAsset({
        type: "component",
        name: "Original Name",
        createdBy: "user-123",
      });

      await repository.create(asset);

      const updated = await repository.update(asset.id, {
        name: "Updated Name",
        description: "New description",
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.description).toBe("New description");
      expect(updated.id).toBe(asset.id);
      expect(updated.updatedAt).toBeDefined();

      const found = await repository.findById(asset.id);
      expect(found?.name).toBe("Updated Name");
      expect(found?.description).toBe("New description");
    });

    it("should preserve existing fields when updating", async () => {
      const asset = createAsset({
        type: "component",
        name: "Original Name",
        createdBy: "user-123",
        tags: ["tag1", "tag2"],
      });

      await repository.create(asset);

      const updated = await repository.update(asset.id, {
        name: "Updated Name",
      });

      expect(updated.tags).toEqual(["tag1", "tag2"]);
      expect(updated.type).toBe("component");
      expect(updated.createdBy).toBe("user-123");
    });
  });

  describe("delete", () => {
    it("should delete asset", async () => {
      const asset = createAsset({
        type: "component",
        name: "Test Component",
        createdBy: "user-123",
      });

      await repository.create(asset);
      await repository.delete(asset.id);

      const found = await repository.findById(asset.id);
      expect(found).toBeNull();
    });

    it("should not throw when deleting non-existent asset", async () => {
      await expect(repository.delete("non-existent-id")).resolves.not.toThrow();
    });

    it("should only delete specified asset", async () => {
      const asset1 = createAsset({
        type: "component",
        name: "Component 1",
        createdBy: "user-123",
      });

      const asset2 = createAsset({
        type: "component",
        name: "Component 2",
        createdBy: "user-123",
      });

      await repository.create(asset1);
      await repository.create(asset2);

      await repository.delete(asset1.id);

      const found1 = await repository.findById(asset1.id);
      const found2 = await repository.findById(asset2.id);

      expect(found1).toBeNull();
      expect(found2).toEqual(asset2);
    });
  });
});

