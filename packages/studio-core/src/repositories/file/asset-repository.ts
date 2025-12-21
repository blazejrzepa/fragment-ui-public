/**
 * File-based implementation of AssetRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { Asset } from "../../entities/asset";
import type { AssetRepository } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const ASSETS_FILE = join(STORAGE_DIR, "assets.json");

export class FileAssetRepository implements AssetRepository {
  private resetPending: boolean;

  constructor() {
    // In tests, start each repository instance with a clean file
    this.resetPending = process.env.NODE_ENV === "test";
  }

  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(ASSETS_FILE);
    } catch {
      // Initialize with empty array
      await fs.writeFile(ASSETS_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readAssets(): Promise<Asset[]> {
    await this.ensureStorage();

    // In test env, clear on first read per repository instance
    if (this.resetPending) {
      await this.writeAssets([]); // clears file
      this.resetPending = false;
    }

    const content = await fs.readFile(ASSETS_FILE, "utf-8");
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  }

  private async writeAssets(assets: Asset[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
  }

  async create(asset: Asset): Promise<Asset> {
    const assets = await this.readAssets();
    assets.push(asset);
    await this.writeAssets(assets);
    return asset;
  }

  async findById(id: string): Promise<Asset | null> {
    const assets = await this.readAssets();
    return assets.find(a => a.id === id) ?? null;
  }

  async findByType(type: Asset["type"]): Promise<Asset[]> {
    const assets = await this.readAssets();
    return assets.filter(a => a.type === type);
  }

  async findByProject(projectId: string): Promise<Asset[]> {
    const assets = await this.readAssets();
    return assets.filter(a => a.projectId === projectId);
  }

  async update(id: string, updates: Partial<Asset>): Promise<Asset> {
    const assets = await this.readAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Asset ${id} not found`);
    }
    assets[index] = { 
      ...assets[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    await this.writeAssets(assets);
    return assets[index];
  }

  async delete(id: string): Promise<void> {
    const assets = await this.readAssets();
    const filtered = assets.filter(a => a.id !== id);
    await this.writeAssets(filtered);
  }
}

