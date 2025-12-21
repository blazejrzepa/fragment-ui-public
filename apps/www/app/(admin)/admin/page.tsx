"use client";

import * as React from "react";
import { ThemeToggle } from "../../../src/components/theme-provider";
import { KPIDashboard } from "@fragment_ui/blocks";
import { DataTable, DataTableColumn } from "@fragment_ui/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { ToggleGroup, ToggleGroupItem } from "@fragment_ui/ui";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Avatar } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { MetricCard } from "@fragment_ui/ui";
import { Spinner } from "@fragment_ui/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import { Download, Calendar, Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

// Sample data
const samplePayments = [
  { id: "1", name: "Alice Johnson", item: "Pro subscription", price: "$120.00" },
  { id: "2", name: "Marcus Green", item: "Analytics add-on", price: "$65.00" },
  { id: "3", name: "Diana Patel", item: "Seats (3)", price: "$180.00" },
  { id: "4", name: "Evan Wright", item: "Usage overage", price: "$42.00" },
  { id: "5", name: "Lena Carter", item: "Support plan", price: "$90.00" },
  { id: "6", name: "Oscar Miles", item: "Enterprise license", price: "$540.00" },
];

const sampleTeamMembers = [
  { id: "1", name: "Dale Komen", email: "dale@example.com", role: "Member", initials: "DK" },
  { id: "2", name: "Sofia Davis", email: "m@example.com", role: "Owner", initials: "SD" },
  { id: "3", name: "Jackson Lee", email: "p@example.com", role: "Member", initials: "JL" },
  { id: "4", name: "Emma Wilson", email: "emma@example.com", role: "Member", initials: "EW" },
];

// Area chart data for Recharts - 12 months
const areaChartData = [
  { name: "Jan", value: 1200, value2: 800 },
  { name: "Feb", value: 1900, value2: 1200 },
  { name: "Mar", value: 3000, value2: 2000 },
  { name: "Apr", value: 2780, value2: 1800 },
  { name: "May", value: 1890, value2: 1500 },
  { name: "Jun", value: 2390, value2: 1700 },
  { name: "Jul", value: 3200, value2: 2200 },
  { name: "Aug", value: 2800, value2: 2000 },
  { name: "Sep", value: 3500, value2: 2500 },
  { name: "Oct", value: 3100, value2: 2300 },
  { name: "Nov", value: 2900, value2: 2100 },
  { name: "Dec", value: 3600, value2: 2600 },
];

// Weekly chart data for Last Month (4 weeks)
const weeklyChartData = [
  { name: "Week 1", value: 850, value2: 600 },
  { name: "Week 2", value: 920, value2: 680 },
  { name: "Week 3", value: 1100, value2: 750 },
  { name: "Week 4", value: 980, value2: 710 },
];

// Tooltip styled for both light/dark via CSS variables
const SalesTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border-base)] bg-[color:var(--background-primary)] p-[var(--space-3)] shadow-lg min-w-[180px]">
      <p className="text-[length:var(--typography-size-xs)] font-medium text-[color:var(--color-fg-base)] mb-[var(--space-2)]">{label}</p>
      <div className="space-y-[var(--space-1)]">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-[var(--space-2)]">
            <span
              className="inline-block h-[var(--space-2)] w-[var(--space-2)] rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[length:var(--typography-size-xs)] text-[color:var(--color-fg-muted)]">{entry.name}</span>
            <span className="ml-auto text-[length:var(--typography-size-xs)] font-semibold text-[color:var(--color-fg-base)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Tooltip component for Subscriptions chart
const CustomSubscriptionsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-[var(--radius-lg)] border border-[color:var(--color-border-base)] bg-[color:var(--background-primary)] p-[var(--space-3)] shadow-lg"
      >
        <p className="text-[length:var(--typography-size-sm)] font-medium text-[color:var(--color-fg-base)] mb-[var(--space-2)]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-[var(--space-2)]">
            <div 
              className="h-[var(--space-3)] w-[var(--space-3)] rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
              {entry.name}: 
            </span>
            <span className="text-[length:var(--typography-size-sm)] font-semibold text-[color:var(--color-fg-base)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const pageSize = 10;
  const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [timePeriod, setTimePeriod] = React.useState<string>("last-year");

  // Filter chart data based on selected time period
  const filteredChartData = React.useMemo(() => {
    if (timePeriod === "last-6-months") {
      // Last 6 months: Jul, Aug, Sep, Oct, Nov, Dec
      return areaChartData.slice(6);
    } else if (timePeriod === "last-month") {
      // Last month: Show weekly data (4 weeks)
      return weeklyChartData;
    } else {
      // Last year: All 12 months
      return areaChartData;
    }
  }, [timePeriod]);

  const paymentColumns: DataTableColumn<typeof samplePayments[0]>[] = [
    {
      id: "name",
      header: "Name",
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      id: "item",
      header: "Item",
      accessor: (row) => row.item,
      sortable: true,
    },
    {
      id: "price",
      header: "Price",
      accessor: (row) => row.price,
      sortable: true,
    },
  ];

  return (
    <div className="space-y-[var(--space-6)]" data-admin-root>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[length:var(--typography-display-sm-size)] font-medium">Dashboard</h1>
          <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)] mt-[var(--space-1)]">Overview & analytics</p>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <Button variant="outline" size="sm" leadingIcon={<Download className="h-[var(--space-4)] w-[var(--space-4)]" />}>
            Download
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<Calendar className="h-[var(--space-4)] w-[var(--space-4)]" />}>
            Pick a date
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
          <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-[var(--space-6)] mt-[var(--space-6)]">
          {/* KPI Cards Grid */}
          <div className="grid gap-[var(--space-4)] md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="New Subscriptions"
              value="4,682"
              description="Since Last week"
              trend="up"
              trendValue="+15.54%"
              icon={<Users className="h-[var(--space-4)] w-[var(--space-4)]" />}
              footerPlacement="content"
            />
            <MetricCard
              title="New Orders"
              value="1,226"
              description="Since Last week"
              trend="up"
              trendValue="+40.2%"
              icon={<ShoppingCart className="h-[var(--space-4)] w-[var(--space-4)]" />}
              footerPlacement="content"
            />
            <MetricCard
              title="Avg Order Revenue"
              value="1,080"
              description="Since Last week"
              trend="up"
              trendValue="+10.8%"
              icon={<TrendingUp className="h-[var(--space-4)] w-[var(--space-4)]" />}
              footerPlacement="content"
            />
            <MetricCard
              title="Total Revenue"
              value="$15,231.89"
              description="+20.1% from last month"
              trend="up"
              trendValue="+20.1%"
              icon={<DollarSign className="h-[var(--space-4)] w-[var(--space-4)]" />}
              footerPlacement="content"
            />
          </div>

          {/* Chart: Sale Activity - full width */}
          <Card className="w-full min-w-0 bg-[color:var(--color-surface-1)]">
            <CardHeader>
              <div className="flex items-start justify-between gap-[var(--space-4)] w-full">
                <div className="flex-1">
                  <CardTitle className="text-[length:var(--typography-size-lg)]">Sale Activity</CardTitle>
                  <CardDescription
                    className="text-[color:var(--color-fg-muted)] mt-[var(--space-2)]"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {timePeriod === "last-year" && "Showing total sales for the last year"}
                    {timePeriod === "last-6-months" && "Showing total sales for the last 6 months"}
                    {timePeriod === "last-month" && "Showing total sales for the last month"}
                  </CardDescription>
                </div>
                <ToggleGroup
                  type="single"
                  value={timePeriod}
                  onValueChange={(value) => {
                    if (value) {
                      setTimePeriod(value);
                    }
                  }}
                  variant="outline"
                  spacing="0"
                  className="flex-shrink-0"
                >
                  <ToggleGroupItem value="last-year" aria-label="Last Year" variant="outline" spacing="0">
                    Last Year
                  </ToggleGroupItem>
                  <ToggleGroupItem value="last-6-months" aria-label="Last 6 months" variant="outline" spacing="0">
                    Last 6 months
                  </ToggleGroupItem>
                  <ToggleGroupItem value="last-month" aria-label="Last Month" variant="outline" spacing="0">
                    Last Month
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardHeader>
            <CardContent className="pt-[var(--space-6)] p-0 overflow-hidden min-w-0 w-full">
              <div ref={chartContainerRef} className="w-full min-w-0">
                <div className="h-[350px] w-full min-w-[320px]">
                  <ResponsiveContainer
                    width="100%"
                    height={350}
                    minWidth={320}
                    minHeight={280}
                  >
                      <AreaChart data={filteredChartData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
                        <defs>
                          {/* Use design tokens for chart colors */}
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-fg-muted)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-fg-muted)" stopOpacity={0} />
                          </linearGradient>
                          {/* Secondary series */}
                          <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-border-base)" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="var(--color-border-base)" stopOpacity={0.12} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="var(--color-border-base)" 
                          strokeOpacity={0.6}
                          horizontal={true}
                          vertical={false}
                        />
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="var(--color-border-base)" 
                          strokeOpacity={0.0}
                          horizontal={false}
                          vertical={true}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }}
                          axisLine={{ stroke: "var(--color-border-base)", strokeOpacity: 0.25 }}
                          padding={{ left: 0, right: 5 }}
                          interval={0}
                        />
                        <YAxis hide />
                        <Tooltip content={<SalesTooltip />} />
                        <Area
                          type="monotoneX"
                          connectNulls
                          dataKey="value"
                          stroke="var(--color-fg-muted)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                        <Area
                          type="monotoneX"
                          connectNulls
                          dataKey="value2"
                          stroke="var(--color-border-base)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          fillOpacity={1}
                          fill="url(#colorValue2)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments and Team Members Grid */}
          <div className="grid gap-[var(--space-6)] lg:grid-cols-2">
            {/* Payments */}
            <Card className="w-full bg-transparent">
              <CardHeader>
                <CardTitle className="text-[length:var(--typography-size-lg)]">Payments</CardTitle>
                <CardDescription className="text-[color:var(--color-fg-muted)]">Manage your payments.</CardDescription>
              </CardHeader>
              <CardContent className="w-full mt-[10px] sm:mt-[10px] mb-0">
                <div className="w-full">
                  <DataTable data={samplePayments} columns={paymentColumns} />
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-[length:var(--typography-size-lg)]">Team Members</CardTitle>
                <CardDescription className="text-[color:var(--color-fg-muted)]">Invite your team members to collaborate.</CardDescription>
              </CardHeader>
              <CardContent className="pt-[var(--space-3)] pb-0 px-0 w-full">
                <div className="space-y-[var(--space-1)] w-full">
                  {sampleTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-[var(--space-3)] rounded-[var(--radius-md)] hover:bg-[color:var(--color-surface-2)]"
                    >
                      <div className="flex items-center gap-[var(--space-3)]">
                        <Avatar fallback={member.initials} />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <Badge variant={member.role === "Owner" ? "solid" : "subtle"}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-[var(--space-6)] mt-[var(--space-6)]">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[color:var(--color-fg-muted)]">Analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-[var(--space-6)] mt-[var(--space-6)]">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[color:var(--color-fg-muted)]">Reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-[var(--space-6)] mt-[var(--space-6)]">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[color:var(--color-fg-muted)]">Notifications content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

