#!/usr/bin/env node

/**
 * Test script for MCP Server
 * Tests all tools and resources programmatically
 */

import { getComponentInfo, suggestComponent } from "./packages/mcp-server/dist/components.js";
import { validateCode } from "./packages/mcp-server/dist/validators.js";
import { generateComponentCode } from "./packages/mcp-server/dist/generators.js";
import { getTokens } from "./packages/mcp-server/dist/tokens.js";

async function testGetComponentInfo() {
  console.log("\n📋 Test 1: get_component_info");
  console.log("=" .repeat(50));
  
  const info = await getComponentInfo("button");
  if (info) {
    console.log("✅ Component found:", info.name);
    console.log("   Description:", info.description);
    console.log("   Category:", info.category);
    console.log("   Props:", info.props.length);
    console.log("   Import:", info.importPath);
  } else {
    console.log("❌ Component not found");
  }
}

async function testSuggestComponent() {
  console.log("\n💡 Test 2: suggest_component");
  console.log("=" .repeat(50));
  
  const suggestions = await suggestComponent("form input with validation");
  console.log(`✅ Found ${suggestions.length} suggestions:`);
  suggestions.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.component} (confidence: ${(s.confidence * 100).toFixed(0)}%)`);
  });
}

async function testValidateCode() {
  console.log("\n✅ Test 3: validate_code");
  console.log("=" .repeat(50));
  
  const code = `
const MyComponent = () => {
  const color = '#ff0000';
  const spacing = '16px';
  return <div style={{ color, padding: spacing }}>Hello</div>;
};
  `.trim();
  
  const result = await validateCode(code);
  console.log(`✅ Validation complete`);
  console.log(`   Valid: ${result.valid}`);
  console.log(`   Errors: ${result.errors.length}`);
  console.log(`   Warnings: ${result.warnings.length}`);
  
  if (result.errors.length > 0) {
    console.log("\n   Errors:");
    result.errors.forEach((e, i) => {
      console.log(`   ${i + 1}. [Line ${e.line}] ${e.message}`);
      if (e.fix) console.log(`      Fix: ${e.fix}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log("\n   Warnings:");
    result.warnings.forEach((w, i) => {
      console.log(`   ${i + 1}. [Line ${w.line}] ${w.message}`);
    });
  }
}

async function testGenerateComponent() {
  console.log("\n🔨 Test 4: generate_component");
  console.log("=" .repeat(50));
  
  try {
    const code = await generateComponentCode("button", {
      children: "Click me",
    }, "solid");
    console.log("✅ Code generated:");
    console.log(code);
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

async function testGetTokens() {
  console.log("\n🎨 Test 5: get_tokens");
  console.log("=" .repeat(50));
  
  const tokens = await getTokens("color");
  console.log("✅ Tokens retrieved");
  console.log("   Categories:", Object.keys(tokens).join(", "));
  
  if (tokens.color) {
    const colorKeys = Object.keys(tokens.color);
    console.log(`   Color tokens: ${colorKeys.length} categories`);
  }
}

async function runAllTests() {
  console.log("🧪 Testing Fragment UI MCP Server");
  console.log("=" .repeat(50));
  
  try {
    await testGetComponentInfo();
    await testSuggestComponent();
    await testValidateCode();
    await testGenerateComponent();
    await testGetTokens();
    
    console.log("\n" + "=" .repeat(50));
    console.log("✅ All tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

runAllTests();

