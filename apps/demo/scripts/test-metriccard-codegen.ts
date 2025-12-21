/**
 * Test MetricCard code generation
 */

import { readFileSync } from "fs";
import { join } from "path";

// Import directly from source to avoid module resolution issues
const dslCodegenPath = join(__dirname, "../src/lib/dsl-codegen.ts");
const importPlannerPath = join(__dirname, "../src/lib/import-planner.ts");

// Load registry
const registryPath = join(__dirname, "../../../packages/registry/registry.json");
let registry: any = { components: {} };
try {
  registry = JSON.parse(readFileSync(registryPath, "utf-8"));
} catch (error) {
  console.warn("⚠️  Could not load registry");
}

// Test DSL with MetricCard
const testDSL = {
  type: "page",
  id: "test-page",
  title: "Test Dashboard",
  children: [
    {
      type: "grid",
      id: "metrics-grid",
      columns: 4,
      responsive: {
        sm: 1,
        md: 2,
        lg: 4,
        xl: 4,
      },
      children: [
        {
          type: "component",
          id: "metric-1",
          component: "MetricCard",
          props: {
            title: "Total Users",
            value: "1,200",
            trend: "up",
            trendValue: "+12.5%",
            description: "From last month",
          },
        },
      ],
    },
  ],
};

console.log("🧪 Testing MetricCard Code Generation\n");
console.log("1️⃣ DSL Structure:");
console.log(JSON.stringify(testDSL.children[0].children[0], null, 2));
console.log("\n2️⃣ Registry Check:");
console.log("   MetricCard (PascalCase):", registry.components?.MetricCard ? "✅" : "❌");
console.log("   metric-card (kebab-case):", registry.components?.["metric-card"] ? "✅" : "❌");

if (registry.components?.["metric-card"]) {
  console.log("\n3️⃣ Registry Entry:");
  console.log(JSON.stringify(registry.components["metric-card"], null, 2));
}

console.log("\n✅ Test completed. Check if MetricCard is properly mapped in registry.");

