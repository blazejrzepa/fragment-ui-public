/**
 * File-based implementation of SubmissionRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { Submission, SubmissionRepository } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const SUBMISSIONS_FILE = join(STORAGE_DIR, "submissions.json");

export class FileSubmissionRepository implements SubmissionRepository {
  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(SUBMISSIONS_FILE);
    } catch {
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readSubmissions(): Promise<Submission[]> {
    await this.ensureStorage();
    const content = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeSubmissions(submissions: Submission[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  }

  async create(submission: Submission): Promise<Submission> {
    const submissions = await this.readSubmissions();
    submissions.push(submission);
    await this.writeSubmissions(submissions);
    return submission;
  }

  async findById(id: string): Promise<Submission | null> {
    const submissions = await this.readSubmissions();
    return submissions.find(s => s.id === id) ?? null;
  }

  async findByRevisionId(revisionId: string): Promise<Submission | null> {
    const submissions = await this.readSubmissions();
    return submissions.find(s => s.revisionId === revisionId) ?? null;
  }

  async findByStatus(status: Submission["status"]): Promise<Submission[]> {
    const submissions = await this.readSubmissions();
    return submissions.filter(s => s.status === status);
  }

  async update(id: string, updates: Partial<Submission>): Promise<Submission> {
    const submissions = await this.readSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Submission ${id} not found`);
    }
    submissions[index] = { ...submissions[index], ...updates };
    await this.writeSubmissions(submissions);
    return submissions[index];
  }
}

