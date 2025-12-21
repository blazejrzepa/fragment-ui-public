/**
 * File-based implementation of ExperimentRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { Experiment } from "../../entities/experiment";
import type { ExperimentRepository } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const EXPERIMENTS_FILE = join(STORAGE_DIR, "experiments.json");

export class FileExperimentRepository implements ExperimentRepository {
  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(EXPERIMENTS_FILE);
    } catch {
      await fs.writeFile(EXPERIMENTS_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readExperiments(): Promise<Experiment[]> {
    await this.ensureStorage();
    const content = await fs.readFile(EXPERIMENTS_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeExperiments(experiments: Experiment[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(EXPERIMENTS_FILE, JSON.stringify(experiments, null, 2));
  }

  async create(experiment: Experiment): Promise<Experiment> {
    const experiments = await this.readExperiments();
    experiments.push(experiment);
    await this.writeExperiments(experiments);
    return experiment;
  }

  async findById(id: string): Promise<Experiment | null> {
    const experiments = await this.readExperiments();
    return experiments.find(e => e.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Experiment | null> {
    const experiments = await this.readExperiments();
    return experiments.find(e => e.slug === slug) ?? null;
  }

  async findByProject(projectId: string): Promise<Experiment[]> {
    const experiments = await this.readExperiments();
    return experiments.filter(e => e.projectId === projectId);
  }

  async findByStatus(status: Experiment["status"]): Promise<Experiment[]> {
    const experiments = await this.readExperiments();
    return experiments.filter(e => e.status === status);
  }

  async update(id: string, updates: Partial<Experiment>): Promise<Experiment> {
    const experiments = await this.readExperiments();
    const index = experiments.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Experiment ${id} not found`);
    }
    experiments[index] = { 
      ...experiments[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    await this.writeExperiments(experiments);
    return experiments[index];
  }

  async delete(id: string): Promise<void> {
    const experiments = await this.readExperiments();
    const filtered = experiments.filter(e => e.id !== id);
    await this.writeExperiments(filtered);
  }
}

