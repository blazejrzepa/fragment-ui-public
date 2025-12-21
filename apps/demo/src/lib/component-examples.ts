/**
 * Component Examples Utility
 * 
 * Shared utility for generating component preview code examples.
 * Contains full examples with variable definitions needed for components like ActivityFeed.
 */

// UI components exceptions (components with hyphens that are UI components, not blocks)
const uiComponentExceptions = [
  "multi-select",
  "command-palette",
  "date-picker",
  "toggle-group",
  "tree-view",
  "color-picker",
  "segmented-control",
  "rating",
  "file-upload",
  "split-button",
  "tag-input",
  "activity-feed",
  "quick-actions",
  "filter-bar",
  "metric-card",
  "chart",
  "dropdown-menu",
  "context-menu",
  "hover-card",
  "navigation-menu",
  "scroll-area",
  "aspect-ratio",
  "data-table",
  "form-field",
];

/**
 * Generates component preview code without render() call
 * Used by ComponentCodeGenerator to generate examples with full variable definitions
 */
export function generateComponentCodeWithoutRender(componentName: string, componentInfo: any): string {
  // Use pre-generated example from registry if available
  if (componentInfo?.example?.code) {
    const code = componentInfo.example.code;
    // Remove render() call if present (ComponentRenderer will add it)
    return code.replace(/\n\s*render\s*\([^)]*\)\s*;?\s*$/s, '').trim();
  }
  
  // Generate code using internal function
  return generateComponentPreviewCodeInternal(componentName, componentInfo);
}

/**
 * Internal function that generates component code without render() call
 */
function generateComponentPreviewCodeInternal(componentName: string, componentInfo: any): string {
  // Generate a simple preview code for the component
  const packageName = (!componentName.includes("-") || uiComponentExceptions.includes(componentName))
    ? "@fragment_ui/ui"
    : "@fragment_ui/blocks";
  
  // Convert kebab-case to PascalCase for component name
  const acronymMap: Record<string, string> = {
    "kpi": "KPI",
    "api": "API",
    "ui": "UI",
    "id": "ID",
    "url": "URL",
    "http": "HTTP",
    "html": "HTML",
    "css": "CSS",
    "js": "JS",
  };
  
  const componentDisplayName = componentName
    .split("-")
    .map(word => {
      const lowerWord = word.toLowerCase();
      return acronymMap[lowerWord] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
  
  // Generate basic example based on component type
  const examples: Record<string, string> = {
    "activity-feed": `import { ActivityFeed } from "${packageName}";

export default function Preview() {
  const activities = [
    {
      id: "1",
      type: "action",
      title: "John Doe created a new project",
      timestamp: new Date(),
      user: { name: "John Doe" },
    },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ActivityFeed items={activities} />
    </div>
  );
}`,
    "analytics-dashboard": `import { AnalyticsDashboard } from "${packageName}";

export default function Preview() {
  const data = {
    users: 1000,
    revenue: 50000,
    orders: 150,
    growth: 12.5,
  };
  const chartData = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <AnalyticsDashboard data={data} chartData={chartData} />
    </div>
  );
}`,
    "filter-bar": `import { FilterBar } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FilterBar
        filters={[
          {
            id: "search",
            type: "search",
            placeholder: "Search...",
            value: search,
            onChange: (value) => setSearch(value),
          },
        ]}
        onClear={() => setSearch("")}
      />
    </div>
  );
}`,
    "chart": `import { Chart } from "${packageName}";

export default function Preview() {
  const data = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Chart data={data} type="line" height={200} />
    </div>
  );
}`,
    "metric-card": `import { MetricCard } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        trend="up"
        trendValue="+20.1%"
        description="From last month"
      />
    </div>
  );
}`,
    "pricing-table": `import { PricingTable } from "${packageName}";

export default function Preview() {
  const tiers = [
    {
      name: "Starter",
      description: "Perfect for getting started",
      price: "$9",
      pricePeriod: "month",
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "10GB storage", included: true },
        { name: "Basic support", included: true },
      ],
      ctaText: "Get Started",
      ctaOnClick: () => console.log("Starter plan clicked"),
    },
    {
      name: "Pro",
      description: "For professionals",
      price: "$29",
      pricePeriod: "month",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "100GB storage", included: true },
        { name: "Priority support", included: true },
      ],
      ctaText: "Get Started",
      ctaOnClick: () => console.log("Pro plan clicked"),
    },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <PricingTable tiers={tiers} />
    </div>
  );
}`,
    "dashboard-layout": `import { DashboardLayout } from "${packageName}";
import { Button } from "@fragment_ui/ui";

export default function Preview() {
  return (
    <DashboardLayout
      header={<h1 className="text-xl font-semibold">Dashboard</h1>}
      sidebar={
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">Overview</Button>
          <Button variant="ghost" className="w-full justify-start">Analytics</Button>
          <Button variant="ghost" className="w-full justify-start">Settings</Button>
        </div>
      }
    />
  );
}`,
    "dashboard-widgets": `import { DashboardWidgets } from "${packageName}";
import { MetricCard } from "@fragment_ui/ui";

export default function Preview() {
  return (
    <DashboardWidgets
      widgets={[
        {
          id: "1",
          type: "metric",
          content: <MetricCard title="Users" value="1000" />
        }
      ]}
      columns={12}
    />
  );
}`,
    "kpi-dashboard": `import { KPIDashboard } from "${packageName}";

export default function Preview() {
  const kpis = [
    { id: "1", label: "Total Users", value: "10,000", trend: "up", change: "+12%" },
    { id: "2", label: "Revenue", value: "$50K", trend: "up", change: "+5%" },
    { id: "3", label: "Orders", value: "500", trend: "down", change: "-2%" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <KPIDashboard kpis={kpis} />
    </div>
  );
}`,
    "benefits-section": `import { BenefitsSection } from "${packageName}";

export default function Preview() {
  return (
    <BenefitsSection
      title="Why Choose Us"
      benefits={[
        { title: "Fast", description: "Lightning fast performance" },
        { title: "Secure", description: "Enterprise-grade security" },
        { title: "Scalable", description: "Grows with your needs" }
      ]}
      columns={3}
    />
  );
}`,
    "comparison-section": `import { ComparisonSection } from "${packageName}";

export default function Preview() {
  return (
    <ComparisonSection
      title="Compare Plans"
      plans={[
        { name: "Basic", features: ["Feature 1", "Feature 2"], price: "$9" },
        { name: "Pro", features: ["Feature 1", "Feature 2", "Feature 3"], price: "$29" },
      ]}
    />
  );
}`,
    "footer-section": `import { FooterSection } from "${packageName}";

export default function Preview() {
  return (
    <FooterSection
      links={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
      copyright="© 2024 Company"
    />
  );
}`,
  };
  
  // Check if we have a specific example
  const normalizedName = componentName.toLowerCase();
  if (examples[normalizedName]) {
    return examples[normalizedName];
  }
  
  // Default fallback: generate basic component usage
  return `import { ${componentDisplayName} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <${componentDisplayName} />
    </div>
  );
}`;
}

