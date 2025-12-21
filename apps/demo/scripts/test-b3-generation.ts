/**
 * Test script for B3: Enhanced DSL Generator
 * 
 * Tests dashboard and landing page generation via API
 */

import { readFileSync } from "fs";
import { join } from "path";

// Try to load registry, fallback to empty if not found
let registry: any = { components: {} };
try {
  const registryPath = join(__dirname, "../../../packages/registry/registry.json");
  registry = JSON.parse(readFileSync(registryPath, "utf-8"));
} catch (error) {
  console.warn("⚠️  Could not load registry, using empty registry");
}

// Test via API endpoint
async function testViaAPI() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
  console.log("🧪 Testing B3: Enhanced DSL Generator via API\n");

  // Test 1: Dashboard Generation
  console.log("1️⃣ Testing Dashboard Generation...");
  try {
    const response = await fetch(`${BASE_URL}/api/dsl/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "dashboard for SaaS admin with metrics and widgets",
        intent: "dashboard",
        registry,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const result = await response.json();
    console.log("   ✓ DSL generated:", result.dsl?.type === "page" ? "✅" : "❌");
    console.log("   ✓ Sections:", result.dsl?.children?.length || 0);
    console.log("   ✓ Diagnostics:", result.diagnostics?.length || 0);
    
    // Check for MetricCard in generated code
    const codeResponse = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "dashboard for SaaS admin with metrics",
        intent: "dashboard",
      }),
    });
    
    if (codeResponse.ok) {
      const codeResult = await codeResponse.json();
      const code = codeResult.code || "";
      const hasMetricCard = code.includes("MetricCard");
      const hasResponsive = /grid-cols-\d+|md:grid-cols-\d+|lg:grid-cols-\d+/.test(code);
      const hasImports = code.includes("import");
      
      console.log("   ✓ Generated code has MetricCard:", hasMetricCard ? "✅" : "❌");
      console.log("   ✓ Has responsive classes:", hasResponsive ? "✅" : "❌");
      console.log("   ✓ Has imports:", hasImports ? "✅" : "❌");
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  // Test 2: Landing Page Generation
  console.log("2️⃣ Testing Landing Page Generation...");
  try {
    const response = await fetch(`${BASE_URL}/api/dsl/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "landing page for webinar with hero, features, pricing, and FAQ",
        intent: "landing",
        registry,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const result = await response.json();
    console.log("   ✓ DSL generated:", result.dsl?.type === "page" ? "✅" : "❌");
    
    // Check for hero section
    const hasHero = result.dsl?.children?.some((child: any) => 
      child.type === "section" && child.kind === "hero"
    );
    console.log("   ✓ Has hero section:", hasHero ? "✅" : "❌");
    
    // Check for specialized sections
    const hasPricing = result.dsl?.children?.some((child: any) => 
      child.type === "section" && child.kind === "pricing"
    );
    console.log("   ✓ Has pricing section:", hasPricing ? "✅" : "❌");
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  console.log("✅ B3 API tests completed!\n");
  console.log("ℹ️  Note: For full testing, ensure the dev server is running (pnpm dev)");
}

testViaAPI().catch(console.error);

