/**
 * Component Usage Analytics
 * 
 * Tracks detailed component usage metrics:
 * - Component installations
 * - Component usage in code
 * - Component versions
 * - Component popularity
 * - Component adoption trends
 */

export interface ComponentUsageEvent {
  componentName: string;
  eventType: "install" | "view" | "use" | "remove";
  version?: string;
  repository?: string;
  filePath?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ComponentUsageStats {
  componentName: string;
  totalInstalls: number;
  totalViews: number;
  totalUses: number;
  activeRepositories: number;
  latestVersion?: string;
  firstSeen: number;
  lastSeen: number;
  trend: "increasing" | "decreasing" | "stable";
  popularity: number; // 0-100 score
}

export interface ComponentUsageAnalytics {
  period: "daily" | "weekly" | "monthly";
  startDate: number;
  endDate: number;
  components: ComponentUsageStats[];
  totalComponents: number;
  totalInstalls: number;
  totalViews: number;
  totalUses: number;
  mostPopular: ComponentUsageStats[];
  trendingUp: ComponentUsageStats[];
  trendingDown: ComponentUsageStats[];
}

/**
 * Track component installation
 */
export function trackComponentInstall(
  componentName: string,
  version?: string,
  repository?: string,
  metadata?: Record<string, any>
): ComponentUsageEvent {
  return {
    componentName,
    eventType: "install",
    version,
    repository,
    timestamp: Date.now(),
    metadata,
  };
}

/**
 * Track component view (documentation page view)
 */
export function trackComponentView(
  componentName: string,
  version?: string,
  metadata?: Record<string, any>
): ComponentUsageEvent {
  return {
    componentName,
    eventType: "view",
    version,
    timestamp: Date.now(),
    metadata,
  };
}

/**
 * Track component usage in code
 */
export function trackComponentUse(
  componentName: string,
  filePath?: string,
  repository?: string,
  version?: string,
  metadata?: Record<string, any>
): ComponentUsageEvent {
  return {
    componentName,
    eventType: "use",
    version,
    repository,
    filePath,
    timestamp: Date.now(),
    metadata,
  };
}

/**
 * Track component removal
 */
export function trackComponentRemove(
  componentName: string,
  repository?: string,
  metadata?: Record<string, any>
): ComponentUsageEvent {
  return {
    componentName,
    eventType: "remove",
    repository,
    timestamp: Date.now(),
    metadata,
  };
}

/**
 * Calculate component popularity score (0-100)
 */
export function calculatePopularityScore(stats: ComponentUsageStats): number {
  const installWeight = 0.3;
  const viewWeight = 0.2;
  const useWeight = 0.4;
  const repoWeight = 0.1;

  // Normalize values (assuming max values for normalization)
  const maxInstalls = 1000;
  const maxViews = 5000;
  const maxUses = 10000;
  const maxRepos = 50;

  const installScore = Math.min((stats.totalInstalls / maxInstalls) * 100, 100) * installWeight;
  const viewScore = Math.min((stats.totalViews / maxViews) * 100, 100) * viewWeight;
  const useScore = Math.min((stats.totalUses / maxUses) * 100, 100) * useWeight;
  const repoScore = Math.min((stats.activeRepositories / maxRepos) * 100, 100) * repoWeight;

  return Math.round(installScore + viewScore + useScore + repoScore);
}

/**
 * Calculate trend based on recent usage
 */
export function calculateTrend(
  currentPeriod: ComponentUsageStats,
  previousPeriod: ComponentUsageStats
): "increasing" | "decreasing" | "stable" {
  const totalCurrent = currentPeriod.totalUses + currentPeriod.totalInstalls;
  const totalPrevious = previousPeriod.totalUses + previousPeriod.totalInstalls;

  if (totalCurrent > totalPrevious * 1.1) {
    return "increasing";
  } else if (totalCurrent < totalPrevious * 0.9) {
    return "decreasing";
  }
  return "stable";
}

