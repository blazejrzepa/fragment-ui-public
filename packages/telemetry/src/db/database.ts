/**
 * Database Connection and Operations
 * 
 * SQLite database for ROI metrics storage
 */

import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";
import { schema } from "./schema.js";
import type {
  ROIMetric,
  LeadTimeMetric,
  AdoptionRateMetric,
  ReuseRateMetric,
  TimeToShipMetric,
  MaintenanceCostMetric,
  OnboardingTimeMetric,
} from "../roi-metrics.js";

let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  // Determine database path
  const dbDir = process.env.DATABASE_DIR || path.join(process.cwd(), ".data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, "roi-metrics.db");
  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma("journal_mode = WAL");

  // Initialize schema
  db.exec(schema);

  return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Insert ROI metric
 */
export function insertMetric(metric: ROIMetric): number {
  const database = getDatabase();
  const metadata = metric.metadata ? JSON.stringify(metric.metadata) : null;

  const stmt = database.prepare(`
    INSERT INTO roi_metrics (type, value, unit, timestamp, metadata)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    metric.type,
    metric.value,
    metric.unit,
    metric.timestamp,
    metadata
  );

  return result.lastInsertRowid as number;
}

/**
 * Insert lead time metric
 */
export function insertLeadTimeMetric(metric: LeadTimeMetric): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO lead_time_metrics 
    (metric_id, figma_url, pr_url, component_name, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.figmaUrl || null,
    metric.prUrl || null,
    metric.componentName || null,
    metric.startTime,
    metric.endTime
  );

  return metricId;
}

/**
 * Insert adoption rate metric
 */
export function insertAdoptionRateMetric(metric: AdoptionRateMetric): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO adoption_rate_metrics 
    (metric_id, period, total_views, ds_views, percentage)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.period,
    metric.totalViews,
    metric.dsViews,
    metric.percentage
  );

  return metricId;
}

/**
 * Insert reuse rate metric
 */
export function insertReuseRateMetric(metric: ReuseRateMetric): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO reuse_rate_metrics 
    (metric_id, component_name, repository_count, total_repositories, percentage)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.componentName,
    metric.repositoryCount,
    metric.totalRepositories,
    metric.percentage
  );

  return metricId;
}

/**
 * Insert time to ship metric
 */
export function insertTimeToShipMetric(metric: TimeToShipMetric): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO time_to_ship_metrics 
    (metric_id, project_id, before_ds, after_ds, reduction)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.projectId || null,
    metric.beforeDS,
    metric.afterDS,
    metric.reduction
  );

  return metricId;
}

/**
 * Insert maintenance cost metric
 */
export function insertMaintenanceCostMetric(
  metric: MaintenanceCostMetric
): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO maintenance_cost_metrics 
    (metric_id, period, before_ds, after_ds, reduction)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.period,
    metric.beforeDS,
    metric.afterDS,
    metric.reduction
  );

  return metricId;
}

/**
 * Insert onboarding time metric
 */
export function insertOnboardingTimeMetric(
  metric: OnboardingTimeMetric
): number {
  const metricId = insertMetric(metric);
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO onboarding_time_metrics 
    (metric_id, user_id, start_time, end_time, first_component_rendered)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metricId,
    metric.userId || null,
    metric.startTime,
    metric.endTime,
    metric.firstComponentRendered ? 1 : 0
  );

  return metricId;
}

/**
 * Get latest metric by type
 */
export function getLatestMetric(type: string): any | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM roi_metrics
    WHERE type = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `);

  return stmt.get(type) || null;
}

/**
 * Get metrics by type and date range
 */
export function getMetricsByTypeAndRange(
  type: string,
  startDate: number,
  endDate: number
): any[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM roi_metrics
    WHERE type = ? AND timestamp >= ? AND timestamp <= ?
    ORDER BY timestamp DESC
  `);

  return stmt.all(type, startDate, endDate);
}

/**
 * Get aggregated metrics (average, min, max) by type and date range
 */
export function getAggregatedMetrics(
  type: string,
  startDate: number,
  endDate: number
): {
  average: number;
  min: number;
  max: number;
  count: number;
} | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT 
      AVG(value) as average,
      MIN(value) as min,
      MAX(value) as max,
      COUNT(*) as count
    FROM roi_metrics
    WHERE type = ? AND timestamp >= ? AND timestamp <= ?
  `);

  const result = stmt.get(type, startDate, endDate) as any;
  if (!result || result.count === 0) {
    return null;
  }

  return {
    average: result.average || 0,
    min: result.min || 0,
    max: result.max || 0,
    count: result.count || 0,
  };
}

/**
 * Get all metrics for export
 */
export function getAllMetrics(limit?: number): any[] {
  const database = getDatabase();
  const stmt = limit
    ? database.prepare(`
        SELECT * FROM roi_metrics
        ORDER BY timestamp DESC
        LIMIT ?
      `)
    : database.prepare(`
        SELECT * FROM roi_metrics
        ORDER BY timestamp DESC
      `);

  return limit ? stmt.all(limit) : stmt.all();
}

