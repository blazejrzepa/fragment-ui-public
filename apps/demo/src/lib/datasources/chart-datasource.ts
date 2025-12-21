/**
 * Chart Data Source
 * 
 * Generates realistic chart data for line, bar, and pie charts
 */

export interface ChartDataPoint {
  date?: string;
  category?: string;
  value: number;
  count?: number;
  label?: string;
}

export interface ChartData {
  revenue: ChartDataPoint[];
  users: ChartDataPoint[];
  conversion: ChartDataPoint[];
}

/**
 * Generate revenue trend data (line chart)
 */
function generateRevenueData(): ChartDataPoint[] {
  const days = 30;
  const baseValue = 10000;
  const data: ChartDataPoint[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const value = baseValue + Math.random() * 5000 + (days - i) * 100; // Trending up
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  
  return data;
}

/**
 * Generate user distribution data (bar chart)
 */
function generateUserDistributionData(): ChartDataPoint[] {
  const categories = ["New Users", "Active Users", "Returning Users", "Churned Users"];
  return categories.map(category => ({
    category,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));
}

/**
 * Generate conversion data (pie chart)
 */
function generateConversionData(): ChartDataPoint[] {
  const sources = [
    { label: "Organic", value: 35 },
    { label: "Paid Ads", value: 25 },
    { label: "Referral", value: 20 },
    { label: "Direct", value: 15 },
    { label: "Social", value: 5 },
  ];
  
  return sources.map(source => ({
    label: source.label,
    value: source.value,
  }));
}

/**
 * Generate all chart data
 */
export function generateChartData(): ChartData {
  return {
    revenue: generateRevenueData(),
    users: generateUserDistributionData(),
    conversion: generateConversionData(),
  };
}

/**
 * Mock API function for chart data
 * In production, this would fetch from a real API
 */
export async function fetchChartData(
  timeRange: "7d" | "30d" | "90d" | "1y" = "30d"
): Promise<ChartData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Adjust data based on time range
  const data = generateChartData();
  
  if (timeRange === "7d") {
    data.revenue = data.revenue.slice(-7);
  } else if (timeRange === "90d") {
    // Generate 90 days of data
    const days = 90;
    const baseValue = 10000;
    const revenueData: ChartDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const value = baseValue + Math.random() * 5000 + (days - i) * 50;
      revenueData.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
      });
    }
    data.revenue = revenueData;
  }
  
  return data;
}

