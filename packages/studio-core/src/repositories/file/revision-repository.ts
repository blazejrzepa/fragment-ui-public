/**
 * File-based implementation of RevisionRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { Revision } from "../../entities/revision";
import type { RevisionRepository } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const REVISIONS_FILE = join(STORAGE_DIR, "revisions.json");

export class FileRevisionRepository implements RevisionRepository {
  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(REVISIONS_FILE);
    } catch {
      await fs.writeFile(REVISIONS_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readRevisions(): Promise<Revision[]> {
    await this.ensureStorage();
    const content = await fs.readFile(REVISIONS_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeRevisions(revisions: Revision[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(REVISIONS_FILE, JSON.stringify(revisions, null, 2));
  }

  async create(revision: Revision): Promise<Revision> {
    const revisions = await this.readRevisions();
    revisions.push(revision);
    await this.writeRevisions(revisions);
    return revision;
  }

  async findById(revisionId: string): Promise<Revision | null> {
    const revisions = await this.readRevisions();
    return revisions.find(r => r.revisionId === revisionId) ?? null;
  }

  async findByAssetId(assetId: string): Promise<Revision[]> {
    const revisions = await this.readRevisions();
    return revisions.filter(r => r.assetId === assetId);
  }

  async findLatestByAssetId(assetId: string): Promise<Revision | null> {
    const revisions = await this.findByAssetId(assetId);
    if (revisions.length === 0) {
      return null;
    }
    // Sort by createdAt descending and return first
    return revisions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  async findByParent(parentRevisionId: string): Promise<Revision[]> {
    const revisions = await this.readRevisions();
    return revisions.filter(r => r.parentRevisionId === parentRevisionId);
  }

  async update(revisionId: string, updates: Partial<Revision>): Promise<Revision> {
    const revisions = await this.readRevisions();
    const index = revisions.findIndex(r => r.revisionId === revisionId);
    if (index === -1) {
      throw new Error(`Revision ${revisionId} not found`);
    }
    revisions[index] = { ...revisions[index], ...updates };
    await this.writeRevisions(revisions);
    return revisions[index];
  }

  async delete(revisionId: string): Promise<void> {
    const revisions = await this.readRevisions();
    const filtered = revisions.filter(r => r.revisionId !== revisionId);
    await this.writeRevisions(filtered);
  }
}

