/**
 * KPI Data Source
 * 
 * Generates realistic KPI data for dashboard metrics
 */

export interface KPIData {
  revenue: {
    value: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
    description: string;
  };
  users: {
    value: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
    description: string;
  };
  growth: {
    value: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
    description: string;
  };
  churn: {
    value: string;
    trend: "up" | "down" | "neutral";
    trendValue: string;
    description: string;
  };
}

/**
 * Generate realistic KPI data
 */
export function generateKPIData(): KPIData {
  // Generate realistic revenue (in thousands)
  const revenue = Math.floor(Math.random() * 50000) + 10000;
  const revenueTrend = Math.random() > 0.3 ? "up" : Math.random() > 0.5 ? "down" : "neutral";
  const revenueTrendValue = revenueTrend === "up" 
    ? `+${(Math.random() * 20 + 5).toFixed(1)}%`
    : revenueTrend === "down"
    ? `-${(Math.random() * 10 + 1).toFixed(1)}%`
    : "0%";

  // Generate realistic user count
  const users = Math.floor(Math.random() * 50000) + 5000;
  const usersTrend = Math.random() > 0.2 ? "up" : "down";
  const usersTrendValue = usersTrend === "up"
    ? `+${(Math.random() * 15 + 3).toFixed(1)}%`
    : `-${(Math.random() * 8 + 1).toFixed(1)}%`;

  // Generate growth rate
  const growth = (Math.random() * 30 + 5).toFixed(1);
  const growthTrend = Math.random() > 0.3 ? "up" : "neutral";
  const growthTrendValue = growthTrend === "up"
    ? `+${(Math.random() * 5 + 1).toFixed(1)}%`
    : "0%";

  // Generate churn rate (should be low)
  const churn = (Math.random() * 5 + 1).toFixed(2);
  const churnTrend = Math.random() > 0.6 ? "down" : "up"; // Lower is better
  const churnTrendValue = churnTrend === "down"
    ? `-${(Math.random() * 2 + 0.5).toFixed(1)}%`
    : `+${(Math.random() * 1 + 0.1).toFixed(1)}%`;

  return {
    revenue: {
      value: `$${(revenue / 1000).toFixed(1)}k`,
      trend: revenueTrend,
      trendValue: revenueTrendValue,
      description: "Total revenue this month",
    },
    users: {
      value: users.toLocaleString(),
      trend: usersTrend,
      trendValue: usersTrendValue,
      description: "Active users",
    },
    growth: {
      value: `${growth}%`,
      trend: growthTrend,
      trendValue: growthTrendValue,
      description: "Month-over-month growth",
    },
    churn: {
      value: `${churn}%`,
      trend: churnTrend,
      trendValue: churnTrendValue,
      description: "Monthly churn rate",
    },
  };
}

/**
 * Mock API function for KPI data
 * In production, this would fetch from a real API
 */
export async function fetchKPIData(): Promise<KPIData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return generateKPIData();
}

