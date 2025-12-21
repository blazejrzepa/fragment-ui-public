/**
 * Database Schema for ROI Metrics
 * 
 * SQLite schema for storing ROI metrics and historical data
 */

export const schema = `
-- ROI Metrics Table
CREATE TABLE IF NOT EXISTS roi_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  metadata TEXT, -- JSON string
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_roi_metrics_type ON roi_metrics(type);
CREATE INDEX IF NOT EXISTS idx_roi_metrics_timestamp ON roi_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_roi_metrics_type_timestamp ON roi_metrics(type, timestamp);

-- Lead Time Metrics (specific fields)
CREATE TABLE IF NOT EXISTS lead_time_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  figma_url TEXT,
  pr_url TEXT,
  component_name TEXT,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);

-- Adoption Rate Metrics
CREATE TABLE IF NOT EXISTS adoption_rate_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  period TEXT NOT NULL, -- daily, weekly, monthly
  total_views INTEGER NOT NULL,
  ds_views INTEGER NOT NULL,
  percentage REAL NOT NULL,
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);

-- Reuse Rate Metrics
CREATE TABLE IF NOT EXISTS reuse_rate_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  component_name TEXT NOT NULL,
  repository_count INTEGER NOT NULL,
  total_repositories INTEGER NOT NULL,
  percentage REAL NOT NULL,
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);

-- Time to Ship Metrics
CREATE TABLE IF NOT EXISTS time_to_ship_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  project_id TEXT,
  before_ds REAL NOT NULL, -- days
  after_ds REAL NOT NULL, -- days
  reduction REAL NOT NULL, -- percentage
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);

-- Maintenance Cost Metrics
CREATE TABLE IF NOT EXISTS maintenance_cost_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  period TEXT NOT NULL, -- monthly, quarterly, yearly
  before_ds REAL NOT NULL,
  after_ds REAL NOT NULL,
  reduction REAL NOT NULL, -- percentage
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);

-- Onboarding Time Metrics
CREATE TABLE IF NOT EXISTS onboarding_time_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id INTEGER NOT NULL,
  user_id TEXT,
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  first_component_rendered INTEGER NOT NULL, -- boolean as integer
  FOREIGN KEY (metric_id) REFERENCES roi_metrics(id) ON DELETE CASCADE
);
`;

export interface ROIMetricRow {
  id: number;
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  metadata: string | null;
  created_at: number;
}

export interface LeadTimeMetricRow {
  id: number;
  metric_id: number;
  figma_url: string | null;
  pr_url: string | null;
  component_name: string | null;
  start_time: number;
  end_time: number;
}

export interface AdoptionRateMetricRow {
  id: number;
  metric_id: number;
  period: string;
  total_views: number;
  ds_views: number;
  percentage: number;
}

export interface ReuseRateMetricRow {
  id: number;
  metric_id: number;
  component_name: string;
  repository_count: number;
  total_repositories: number;
  percentage: number;
}

export interface TimeToShipMetricRow {
  id: number;
  metric_id: number;
  project_id: string | null;
  before_ds: number;
  after_ds: number;
  reduction: number;
}

export interface MaintenanceCostMetricRow {
  id: number;
  metric_id: number;
  period: string;
  before_ds: number;
  after_ds: number;
  reduction: number;
}

export interface OnboardingTimeMetricRow {
  id: number;
  metric_id: number;
  user_id: string | null;
  start_time: number;
  end_time: number;
  first_component_rendered: number;
}

