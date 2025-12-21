/**
 * File-based implementation of ReleaseRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { ReleaseRepository, Release } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const RELEASES_FILE = join(STORAGE_DIR, "releases.json");

export class FileReleaseRepository implements ReleaseRepository {
  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(RELEASES_FILE);
    } catch {
      await fs.writeFile(RELEASES_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readReleases(): Promise<Release[]> {
    await this.ensureStorage();
    const content = await fs.readFile(RELEASES_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeReleases(releases: Release[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(RELEASES_FILE, JSON.stringify(releases, null, 2));
  }

  async create(release: Release): Promise<Release> {
    const releases = await this.readReleases();
    releases.push(release);
    await this.writeReleases(releases);
    return release;
  }

  async findById(id: string): Promise<Release | null> {
    const releases = await this.readReleases();
    return releases.find(r => r.id === id) ?? null;
  }

  async findByVersion(version: string): Promise<Release | null> {
    const releases = await this.readReleases();
    return releases.find(r => r.version === version) ?? null;
  }

  async findByRevisionId(revisionId: string): Promise<Release | null> {
    const releases = await this.readReleases();
    return releases.find(r => r.revisionId === revisionId) ?? null;
  }

  async findLatest(): Promise<Release | null> {
    const releases = await this.readReleases();
    if (releases.length === 0) return null;
    
    // Sort by createdAt descending and return the latest
    const sorted = releases.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    return sorted[0] ?? null;
  }

  async update(id: string, updates: Partial<Release>): Promise<Release> {
    const releases = await this.readReleases();
    const index = releases.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error(`Release with id ${id} not found`);
    }
    
    releases[index] = {
      ...releases[index],
      ...updates,
    };
    
    await this.writeReleases(releases);
    return releases[index];
  }
}

