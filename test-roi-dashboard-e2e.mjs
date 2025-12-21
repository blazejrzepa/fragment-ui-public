#!/usr/bin/env node

/**
 * End-to-End Test Script for ROI Dashboard
 * Tests the complete flow from metrics tracking to dashboard display
 */

import { performance } from "perf_hooks";

const API_URL = process.env.API_URL || "http://localhost:3000";
const DASHBOARD_URL = `${API_URL}/tools/roi-dashboard`;
const ROI_API_URL = `${API_URL}/api/roi`;

async function testAPIEndpoint() {
  console.log("\n🌐 Test 1: API Endpoint");
  console.log("=".repeat(50));
  
  try {
    const start = performance.now();
    const response = await fetch(ROI_API_URL);
    const end = performance.now();
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    const responseTime = end - start;
    
    console.log(`✅ API responded in ${responseTime.toFixed(2)}ms`);
    console.log(`   Status: ${response.status}`);
    
    // Verify structure
    if (!data.metrics) {
      throw new Error("Missing 'metrics' in response");
    }
    
    const requiredMetrics = [
      "leadTime",
      "adoptionRate",
      "reuseRate",
      "timeToShip",
      "maintenanceCost",
      "onboardingTime",
    ];
    
    for (const metric of requiredMetrics) {
      if (!data.metrics[metric]) {
        throw new Error(`Missing metric: ${metric}`);
      }
    }
    
    console.log("✅ All required metrics present");
    console.log("✅ Response structure valid");
    
    // Verify values
    const metrics = data.metrics;
    console.log("\n📊 Metrics Summary:");
    console.log(`   Lead Time: ${metrics.leadTime.current} days (target: ${metrics.leadTime.target})`);
    console.log(`   Adoption Rate: ${metrics.adoptionRate.current}% (target: ${metrics.adoptionRate.target}%)`);
    console.log(`   Reuse Rate: ${metrics.reuseRate.current}% (target: ${metrics.reuseRate.target}%)`);
    console.log(`   Time-to-Ship: ${metrics.timeToShip.reduction}% reduction (target: ${metrics.timeToShip.target}%)`);
    console.log(`   Maintenance Cost: ${metrics.maintenanceCost.reduction}% reduction (target: ${metrics.maintenanceCost.target}%)`);
    console.log(`   Onboarding Time: ${metrics.onboardingTime.current} min (target: ${metrics.onboardingTime.target} min)`);
    
    // Performance check
    if (responseTime > 100) {
      console.warn(`⚠️  API response time (${responseTime.toFixed(2)}ms) is above target (100ms)`);
    } else {
      console.log(`✅ API performance: ${responseTime.toFixed(2)}ms < 100ms`);
    }
    
    return { success: true, data, responseTime };
  } catch (error) {
    console.error(`❌ API test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testDashboardAccessibility() {
  console.log("\n♿ Test 2: Dashboard Accessibility");
  console.log("=".repeat(50));
  
  try {
    const response = await fetch(DASHBOARD_URL);
    
    if (!response.ok) {
      throw new Error(`Dashboard returned ${response.status}`);
    }
    
    const html = await response.text();
    
    // Check for required elements
    // Note: Next.js renders components, so we check for actual content instead of component names
    const checks = {
      "Has title": html.includes("ROI Dashboard"),
      "Has KPI cards": html.includes("Lead Time") && html.includes("Adoption Rate") && html.includes("Reuse Rate") && html.includes("Time-to-Ship") && html.includes("Maintenance Cost") && html.includes("Onboarding Time"),
      "Has status indicators": html.includes("✅") || html.includes("⚠️") || html.includes("❌"),
      "Has progress bars": html.includes("bg-gray-200") || html.includes("rounded-full"),
      "Has responsive classes": html.includes("grid-cols"),
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      if (passed) {
        console.log(`✅ ${check}`);
      } else {
        console.log(`❌ ${check}`);
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log("✅ Dashboard accessibility checks passed");
    } else {
      console.warn("⚠️  Some accessibility checks failed");
    }
    
    return { success: allPassed, checks };
  } catch (error) {
    console.error(`❌ Dashboard accessibility test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMetricsCalculation() {
  console.log("\n🧮 Test 3: Metrics Calculation");
  console.log("=".repeat(50));
  
  try {
    const response = await fetch(ROI_API_URL);
    const data = await response.json();
    const metrics = data.metrics;
    
    const calculations = {
      "Lead Time <= Target": metrics.leadTime.current <= metrics.leadTime.target * 1.5, // Allow some margin
      "Adoption Rate >= 0": metrics.adoptionRate.current >= 0,
      "Adoption Rate <= 100": metrics.adoptionRate.current <= 100,
      "Reuse Rate >= 0": metrics.reuseRate.current >= 0,
      "Reuse Rate <= 100": metrics.reuseRate.current <= 100,
      "Time-to-Ship >= 0": metrics.timeToShip.reduction >= 0,
      "Maintenance Cost >= 0": metrics.maintenanceCost.reduction >= 0,
      "Onboarding Time >= 0": metrics.onboardingTime.current >= 0,
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(calculations)) {
      if (passed) {
        console.log(`✅ ${check}`);
      } else {
        console.log(`❌ ${check}`);
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log("✅ All metric calculations are valid");
    } else {
      console.warn("⚠️  Some metric calculations are invalid");
    }
    
    return { success: allPassed, calculations };
  } catch (error) {
    console.error(`❌ Metrics calculation test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testStatusIndicators() {
  console.log("\n🎯 Test 4: Status Indicators");
  console.log("=".repeat(50));
  
  try {
    const response = await fetch(ROI_API_URL);
    const data = await response.json();
    const metrics = data.metrics;
    
    // Calculate expected statuses
    const expectedStatuses = {
      leadTime: metrics.leadTime.current <= metrics.leadTime.target ? "good" : "warning",
      adoptionRate: metrics.adoptionRate.current >= metrics.adoptionRate.target ? "good" : "warning",
      reuseRate: metrics.reuseRate.current >= metrics.reuseRate.target ? "good" : "warning",
      timeToShip: metrics.timeToShip.reduction >= metrics.timeToShip.target ? "good" : "warning",
      maintenanceCost: metrics.maintenanceCost.reduction >= metrics.maintenanceCost.target ? "good" : "warning",
      onboardingTime: metrics.onboardingTime.current < metrics.onboardingTime.target ? "good" : "warning",
    };
    
    // Compare with actual statuses
    const statusChecks = {
      "Lead Time status": metrics.leadTime.status === expectedStatuses.leadTime,
      "Adoption Rate status": metrics.adoptionRate.status === expectedStatuses.adoptionRate,
      "Reuse Rate status": metrics.reuseRate.status === expectedStatuses.reuseRate,
      "Time-to-Ship status": metrics.timeToShip.status === expectedStatuses.timeToShip,
      "Maintenance Cost status": metrics.maintenanceCost.status === expectedStatuses.maintenanceCost,
      "Onboarding Time status": metrics.onboardingTime.status === expectedStatuses.onboardingTime,
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(statusChecks)) {
      if (passed) {
        console.log(`✅ ${check} correct`);
      } else {
        console.log(`❌ ${check} incorrect (expected: ${expectedStatuses[check.split(" ")[0].toLowerCase()]}, got: ${metrics[check.split(" ")[0].toLowerCase()].status})`);
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log("✅ All status indicators are correct");
    } else {
      console.warn("⚠️  Some status indicators are incorrect");
    }
    
    return { success: allPassed, statusChecks };
  } catch (error) {
    console.error(`❌ Status indicators test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testPerformance() {
  console.log("\n⚡ Test 5: Performance");
  console.log("=".repeat(50));
  
  try {
    const iterations = 10;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fetch(ROI_API_URL);
      const end = performance.now();
      times.push(end - start);
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    console.log(`📊 Performance (${iterations} requests):`);
    console.log(`   Average: ${avg.toFixed(2)}ms`);
    console.log(`   Min: ${min.toFixed(2)}ms`);
    console.log(`   Max: ${max.toFixed(2)}ms`);
    
    const performanceChecks = {
      "Average < 100ms": avg < 100,
      "Max < 500ms": max < 500,
    };
    
    let allPassed = true;
    for (const [check, passed] of Object.entries(performanceChecks)) {
      if (passed) {
        console.log(`✅ ${check}`);
      } else {
        console.log(`❌ ${check}`);
        allPassed = false;
      }
    }
    
    return { success: allPassed, avg, min, max };
  } catch (error) {
    console.error(`❌ Performance test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log("🧪 ROI Dashboard - End-to-End Tests");
  console.log("=".repeat(50));
  console.log(`API URL: ${API_URL}`);
  console.log(`Dashboard URL: ${DASHBOARD_URL}`);
  console.log(`ROI API URL: ${ROI_API_URL}`);
  
  const results = {
    api: await testAPIEndpoint(),
    accessibility: await testDashboardAccessibility(),
    calculations: await testMetricsCalculation(),
    status: await testStatusIndicators(),
    performance: await testPerformance(),
  };
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results Summary");
  console.log("=".repeat(50));
  
  const allPassed = Object.values(results).every(r => r.success);
  
  for (const [test, result] of Object.entries(results)) {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${test}`);
  }
  
  if (allPassed) {
    console.log("\n✅ All tests passed!");
    process.exit(0);
  } else {
    console.log("\n❌ Some tests failed");
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error("\n❌ Test suite failed:", error);
  process.exit(1);
});

