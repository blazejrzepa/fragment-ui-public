#!/usr/bin/env node

/**
 * Test script for ROI Metrics
 * Tests all ROI metric tracking functions
 */

import {
  trackLeadTime,
  trackAdoptionRate,
  trackReuseRate,
  trackTimeToShip,
  trackMaintenanceCost,
  trackOnboardingTime,
  roiMetricToEvent,
} from "./packages/telemetry/dist/roi-metrics.js";

function testLeadTime() {
  console.log("\n📊 Test 1: trackLeadTime");
  console.log("=" .repeat(50));
  
  const startTime = Date.now() - 86400000; // 1 day ago
  const endTime = Date.now();
  
  const metric = trackLeadTime(startTime, endTime, {
    figmaUrl: "https://figma.com/file/123",
    prUrl: "https://github.com/repo/pull/456",
    componentName: "button",
  });
  
  console.log("✅ Lead Time Metric:");
  console.log(`   Value: ${metric.value.toFixed(2)} ${metric.unit}`);
  console.log(`   Target: ≤ 1.0 days`);
  console.log(`   Status: ${metric.value <= 1.0 ? "✅ Good" : "⚠️ Warning"}`);
  
  return metric;
}

function testAdoptionRate() {
  console.log("\n📈 Test 2: trackAdoptionRate");
  console.log("=" .repeat(50));
  
  const metric = trackAdoptionRate("monthly", 100, 75);
  
  console.log("✅ Adoption Rate Metric:");
  console.log(`   Value: ${metric.value.toFixed(1)}%`);
  console.log(`   Target: ≥ 80%`);
  console.log(`   Status: ${metric.value >= 80 ? "✅ Good" : "⚠️ Warning"}`);
  console.log(`   Total Views: ${metric.totalViews}`);
  console.log(`   DS Views: ${metric.dsViews}`);
  
  return metric;
}

function testReuseRate() {
  console.log("\n♻️  Test 3: trackReuseRate");
  console.log("=" .repeat(50));
  
  const metric = trackReuseRate("button", 5, 10);
  
  console.log("✅ Reuse Rate Metric:");
  console.log(`   Component: ${metric.componentName}`);
  console.log(`   Value: ${metric.value.toFixed(1)}%`);
  console.log(`   Target: ≥ 70%`);
  console.log(`   Status: ${metric.value >= 70 ? "✅ Good" : "⚠️ Warning"}`);
  console.log(`   Repositories: ${metric.repositoryCount}/${metric.totalRepositories}`);
  
  return metric;
}

function testTimeToShip() {
  console.log("\n🚀 Test 4: trackTimeToShip");
  console.log("=" .repeat(50));
  
  const metric = trackTimeToShip(10, 5, { projectId: "project-1" });
  
  console.log("✅ Time-to-Ship Metric:");
  console.log(`   Reduction: ${metric.reduction.toFixed(1)}%`);
  console.log(`   Target: ≥ 40%`);
  console.log(`   Status: ${metric.reduction >= 40 ? "✅ Good" : "⚠️ Warning"}`);
  console.log(`   Before DS: ${metric.beforeDS} days`);
  console.log(`   After DS: ${metric.afterDS} days`);
  
  return metric;
}

function testMaintenanceCost() {
  console.log("\n💰 Test 5: trackMaintenanceCost");
  console.log("=" .repeat(50));
  
  const metric = trackMaintenanceCost("monthly", 100, 70);
  
  console.log("✅ Maintenance Cost Metric:");
  console.log(`   Reduction: ${metric.reduction.toFixed(1)}%`);
  console.log(`   Target: ≥ 30%`);
  console.log(`   Status: ${metric.reduction >= 30 ? "✅ Good" : "⚠️ Warning"}`);
  console.log(`   Before DS: ${metric.beforeDS} hours`);
  console.log(`   After DS: ${metric.afterDS} hours`);
  
  return metric;
}

function testOnboardingTime() {
  console.log("\n🎓 Test 6: trackOnboardingTime");
  console.log("=" .repeat(50));
  
  const startTime = Date.now() - 1800000; // 30 minutes ago
  const endTime = Date.now();
  
  const metric = trackOnboardingTime(startTime, endTime, true, {
    userId: "user-123",
  });
  
  console.log("✅ Onboarding Time Metric:");
  console.log(`   Value: ${metric.value.toFixed(1)} ${metric.unit}`);
  console.log(`   Target: < 30 minutes`);
  console.log(`   Status: ${metric.value < 30 ? "✅ Good" : "⚠️ Warning"}`);
  console.log(`   First Component Rendered: ${metric.firstComponentRendered ? "Yes" : "No"}`);
  
  return metric;
}

function testMetricToEvent() {
  console.log("\n📤 Test 7: roiMetricToEvent");
  console.log("=" .repeat(50));
  
  const metric = trackLeadTime(Date.now() - 86400000, Date.now());
  const event = roiMetricToEvent(metric);
  
  console.log("✅ Metric converted to event:");
  console.log(`   Type: ${event.type}`);
  console.log(`   Name: ${event.name}`);
  console.log(`   Properties:`, JSON.stringify(event.properties, null, 2));
}

async function runAllTests() {
  console.log("🧪 Testing Fragment UI ROI Metrics");
  console.log("=" .repeat(50));
  
  try {
    testLeadTime();
    testAdoptionRate();
    testReuseRate();
    testTimeToShip();
    testMaintenanceCost();
    testOnboardingTime();
    testMetricToEvent();
    
    console.log("\n" + "=" .repeat(50));
    console.log("✅ All ROI metrics tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

runAllTests();

