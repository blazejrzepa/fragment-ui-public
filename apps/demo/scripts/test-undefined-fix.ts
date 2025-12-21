#!/usr/bin/env tsx
/**
 * Test script to verify undefined fixes in code generation
 * Tests: name: "undefined", error={false}, React.createElement("undefined", ...)
 */

async function testUndefinedFix() {
  const BASE_URL = "http://localhost:3002";
  console.log("🧪 Testing undefined fixes in code generation...\n");

  try {
    // Test 1: Generate a simple form using /api/generate
    console.log("📝 Test 1: Generate form with email field");
    const response1 = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Create a simple form with email field",
      }),
    });

    if (!response1.ok) {
      throw new Error(`HTTP ${response1.status}: ${response1.statusText}`);
    }

    const data1 = await response1.json();
    console.log("📦 Response structure:", Object.keys(data1));
    const code1 = data1.code || data1.generatedCode || "";

    console.log("✅ Response received");
    console.log(`📊 Code length: ${code1.length} chars`);
    
    // Show first 500 chars of code for inspection
    if (code1.length > 0) {
      console.log("\n📄 Code preview (first 500 chars):");
      console.log(code1.substring(0, 500));
    }

    // Check for undefined issues
    const hasUndefinedComponent = /React\.createElement\(["']undefined["']/.test(code1);
    const hasUndefinedName = /name:\s*["']undefined["']/.test(code1);
    const hasFalseError = /error:\s*false/.test(code1);
    const hasUndefinedString = /["']undefined["']/.test(code1);

    console.log("\n🔍 Checking for undefined issues:");
    console.log(`  - React.createElement("undefined", ...): ${hasUndefinedComponent ? "❌ FOUND" : "✅ OK"}`);
    console.log(`  - name: "undefined": ${hasUndefinedName ? "❌ FOUND" : "✅ OK"}`);
    console.log(`  - error={false}: ${hasFalseError ? "❌ FOUND" : "✅ OK"}`);
    console.log(`  - Any "undefined" string: ${hasUndefinedString ? "⚠️  FOUND" : "✅ OK"}`);

    if (hasUndefinedComponent || hasUndefinedName || hasFalseError) {
      console.log("\n❌ FAILED: Found undefined issues in generated code");
      console.log("\n📄 Generated code snippet:");
      const snippet = code1.substring(0, 500);
      console.log(snippet);
      return false;
    }

    // Test 2: Generate a button and then patch it
    console.log("\n📝 Test 2: Generate button and patch it");
    const sessionId = `test-${Date.now()}`;
    
    // First, create a button using /api/generate
    const response2 = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Create a simple button with text 'Click me'",
      }),
    });

    if (!response2.ok) {
      throw new Error(`HTTP ${response2.status}: ${response2.statusText}`);
    }

    const data2 = await response2.json();
    console.log("📦 Response structure:", Object.keys(data2));
    const code2 = data2.code || data2.generatedCode || "";

    console.log("✅ Button generated");
    console.log(`📊 Code length: ${code2.length} chars`);

    // Check for undefined issues in button code
    const hasUndefinedInButton = /React\.createElement\(["']undefined["']/.test(code2) || 
                                  /name:\s*["']undefined["']/.test(code2) ||
                                  /error:\s*false/.test(code2);

    if (hasUndefinedInButton) {
      console.log("\n❌ FAILED: Found undefined issues in button code");
      return false;
    }

    // Then, patch the button (need DSL from generate response)
    const response3 = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Change the button text to 'Updated Button'",
        sessionId,
        context: {
          dsl: data2.dsl, // DSL from generate response
          code: code2,
        },
      }),
    });

    if (!response3.ok) {
      throw new Error(`HTTP ${response3.status}: ${response3.statusText}`);
    }

    const data3 = await response3.json();
    console.log("📦 Response structure:", Object.keys(data3));
    console.log("📦 Has appliedPatches:", !!data3.appliedPatches);
    console.log("📦 Intent:", data3.intent);
    console.log("📦 Patches:", data3.patches?.length || 0);
    if (data3.appliedPatches) {
      console.log("📦 AppliedPatches structure:", Object.keys(data3.appliedPatches));
      console.log("📦 Patches applied:", data3.appliedPatches.patchesApplied);
    }
    const code3 = data3.appliedPatches?.code || data3.code || data3.generatedCode || "";

    console.log("✅ Button patched");
    console.log(`📊 Code length: ${code3.length} chars`);

    // Check for undefined issues in patched code
    const hasUndefinedInPatched = /React\.createElement\(["']undefined["']/.test(code3) || 
                                   /name:\s*["']undefined["']/.test(code3) ||
                                   /error:\s*false/.test(code3);

    if (hasUndefinedInPatched) {
      console.log("\n❌ FAILED: Found undefined issues in patched code");
      return false;
    }

    // Check if button text was updated
    const hasUpdatedText = /Updated Button/.test(code3);
    console.log(`  - Button text updated: ${hasUpdatedText ? "✅ YES" : "❌ NO"}`);

    console.log("\n✅ ALL TESTS PASSED!");
    return true;

  } catch (error: any) {
    console.error("\n❌ ERROR:", error.message);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    return false;
  }
}

// Run test
testUndefinedFix()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

