import { NextRequest, NextResponse } from "next/server";

/**
 * Component Usage Analytics API
 * 
 * Returns detailed component usage statistics
 */

interface ComponentUsageStats {
  componentName: string;
  totalInstalls: number;
  totalViews: number;
  totalUses: number;
  activeRepositories: number;
  latestVersion?: string;
  firstSeen: number;
  lastSeen: number;
  trend: "increasing" | "decreasing" | "stable";
  popularity: number;
}

// Mock data - in production, fetch from database
const mockComponentUsage: ComponentUsageStats[] = [
  {
    componentName: "button",
    totalInstalls: 1250,
    totalViews: 8500,
    totalUses: 15200,
    activeRepositories: 45,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 365 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 95,
  },
  {
    componentName: "input",
    totalInstalls: 980,
    totalViews: 7200,
    totalUses: 12800,
    activeRepositories: 38,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 340 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 88,
  },
  {
    componentName: "card",
    totalInstalls: 750,
    totalViews: 5600,
    totalUses: 9800,
    activeRepositories: 32,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 300 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "stable",
    popularity: 75,
  },
  {
    componentName: "dialog",
    totalInstalls: 620,
    totalViews: 4800,
    totalUses: 7200,
    activeRepositories: 28,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 280 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 68,
  },
  {
    componentName: "select",
    totalInstalls: 580,
    totalViews: 4200,
    totalUses: 6800,
    activeRepositories: 25,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 260 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "stable",
    popularity: 62,
  },
  {
    componentName: "table",
    totalInstalls: 520,
    totalViews: 3800,
    totalUses: 5600,
    activeRepositories: 22,
    latestVersion: "1.7.0",
    firstSeen: Date.now() - 240 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 58,
  },
  {
    componentName: "segmented-control",
    totalInstalls: 120,
    totalViews: 850,
    totalUses: 320,
    activeRepositories: 8,
    latestVersion: "1.8.0",
    firstSeen: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 15,
  },
  {
    componentName: "rating",
    totalInstalls: 95,
    totalViews: 720,
    totalUses: 280,
    activeRepositories: 6,
    latestVersion: "1.8.0",
    firstSeen: Date.now() - 25 * 24 * 60 * 60 * 1000,
    lastSeen: Date.now(),
    trend: "increasing",
    popularity: 12,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") || "monthly";
  const componentName = searchParams.get("component");
  const sortBy = searchParams.get("sortBy") || "popularity";
  const limit = parseInt(searchParams.get("limit") || "50");

  let data = [...mockComponentUsage];

  // Filter by component name if provided
  if (componentName) {
    data = data.filter((c) => c.componentName === componentName);
  }

  // Sort data
  data.sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity;
      case "installs":
        return b.totalInstalls - a.totalInstalls;
      case "uses":
        return b.totalUses - a.totalUses;
      case "repositories":
        return b.activeRepositories - a.activeRepositories;
      case "name":
        return a.componentName.localeCompare(b.componentName);
      default:
        return b.popularity - a.popularity;
    }
  });

  // Limit results
  data = data.slice(0, limit);

  // Calculate totals
  const totals = {
    totalComponents: mockComponentUsage.length,
    totalInstalls: mockComponentUsage.reduce((sum, c) => sum + c.totalInstalls, 0),
    totalViews: mockComponentUsage.reduce((sum, c) => sum + c.totalViews, 0),
    totalUses: mockComponentUsage.reduce((sum, c) => sum + c.totalUses, 0),
    totalRepositories: Math.max(...mockComponentUsage.map((c) => c.activeRepositories)),
  };

  // Get trending components
  const trendingUp = mockComponentUsage
    .filter((c) => c.trend === "increasing")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  const trendingDown = mockComponentUsage
    .filter((c) => c.trend === "decreasing")
    .sort((a, b) => a.popularity - b.popularity)
    .slice(0, 5);

  const mostPopular = [...mockComponentUsage]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  return NextResponse.json({
    period,
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    endDate: Date.now(),
    components: data,
    totals,
    mostPopular,
    trendingUp,
    trendingDown,
  });
}

