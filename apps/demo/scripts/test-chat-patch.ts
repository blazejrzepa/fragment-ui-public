/**
 * Integration test for Chat Patch Workflow
 * 
 * Tests the full flow:
 * 1. Chat with intent detection
 * 2. Patch parsing
 * 3. Session management
 */

import { readFileSync } from "fs";
import { join } from "path";

async function testChatPatchWorkflow() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
  console.log("🧪 Testing Chat Patch Workflow\n");

  // Test 1: Generate new component
  console.log("1️⃣ Testing Generate Intent...");
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "create a dashboard with metrics",
        sessionId: "test-session-1",
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("   ✓ Intent:", result.intent);
      console.log("   ✓ Session ID:", result.sessionId);
      console.log("   ✓ Confidence:", result.metadata?.confidence);
      console.log("   ✓ Response:", result.message.substring(0, 100) + "...");
    } else {
      console.log("   ❌ Error:", response.status);
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  // Test 2: Edit intent with DSL context
  console.log("2️⃣ Testing Edit Intent with Patch Parsing...");
  try {
    // First, create a DSL context
    const testDSL = {
      type: "page",
      id: "test-page",
      title: "Test Page",
      children: [
        {
          type: "component",
          id: "button-1",
          component: "Button",
          props: { variant: "solid", size: "md" },
          copy: "Click me",
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "change variant to outline",
        sessionId: "test-session-2",
        context: {
          dsl: testDSL,
          assetId: "asset-1",
          revisionId: "revision-1",
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("   ✓ Intent:", result.intent);
      console.log("   ✓ Patches found:", result.patches?.length || 0);
      if (result.patches && result.patches.length > 0) {
        console.log("   ✓ Patch operation:", result.patches[0].op);
        console.log("   ✓ Patch target:", result.patches[0].targetId);
        console.log("   ✓ Patch args:", JSON.stringify(result.patches[0].args));
      }
      console.log("   ✓ Parsed patches confidence:", result.metadata?.parsedPatches?.confidence);
    } else {
      console.log("   ❌ Error:", response.status);
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  // Test 3: Multiple patches
  console.log("3️⃣ Testing Multiple Patch Operations...");
  try {
    const testDSL = {
      type: "page",
      id: "test-page",
      children: [
        { type: "component", id: "button-1", component: "Button", props: {}, copy: "Click" },
        { type: "component", id: "button-2", component: "Button", props: {}, copy: "Submit" },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "change button-1 variant to outline and change button-2 text to 'Save'",
        sessionId: "test-session-3",
        context: { dsl: testDSL },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("   ✓ Patches found:", result.patches?.length || 0);
      if (result.patches) {
        result.patches.forEach((patch: any, i: number) => {
          console.log(`   ✓ Patch ${i + 1}: ${patch.op} on ${patch.targetId}`);
        });
      }
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  console.log("✅ Chat Patch Workflow tests completed!\n");
  console.log("ℹ️  Note: Ensure dev server is running (pnpm dev)");
}

testChatPatchWorkflow().catch(console.error);

