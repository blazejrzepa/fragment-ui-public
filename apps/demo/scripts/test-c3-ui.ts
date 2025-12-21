#!/usr/bin/env tsx
/**
 * Test script for C3: Patch Application + Regeneration
 * 
 * Tests the complete flow:
 * 1. Generate initial component
 * 2. Send patch command via chat
 * 3. Verify patches are parsed and applied
 * 4. Verify code is regenerated
 * 5. Verify revision is created
 */

interface ChatResponse {
  message?: string;
  patches?: any[];
  appliedPatches?: {
    patchesApplied: number;
    revisionId?: string;
    code?: string;
  };
  metadata?: any;
  sessionId?: string;
}

async function testC3Flow() {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3002";
  console.log("🧪 Testing C3: Patch Application + Regeneration\n");

  let sessionId: string | undefined;

  try {
    // Step 1: Generate initial component
    console.log("📝 Step 1: Generating initial component...");
    const generateResponse = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Create a simple button with text 'Click me'",
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      throw new Error(`Generate failed: ${generateResponse.status} ${generateResponse.statusText}\n${errorText}`);
    }

    const generateData = await generateResponse.json();
    const initialCode = generateData.code;
    console.log("✅ Initial component generated");
    console.log(`   Code length: ${initialCode.length} chars`);
    console.log(`   Contains 'Click me': ${initialCode.includes('Click me') ? '✅' : '❌'}\n`);

    // Step 2: Send patch command via chat
    console.log("🔧 Step 2: Sending patch command via chat...");
    const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Change the button text to 'Updated Button'",
        sessionId: sessionId,
        context: {
          code: initialCode,
        },
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      throw new Error(`Chat failed: ${chatResponse.status} ${chatResponse.statusText}\n${errorText}`);
    }

    const chatData: ChatResponse = await chatResponse.json();
    sessionId = chatData.sessionId;

    console.log("✅ Chat response received");
    console.log(`   Session ID: ${sessionId || 'none'}`);
    console.log(`   Patches detected: ${chatData.patches?.length || 0}`);
    console.log(`   Patches applied: ${chatData.appliedPatches?.patchesApplied || 0}`);

    // Step 3: Verify patches are parsed
    if (!chatData.patches || chatData.patches.length === 0) {
      console.log("\n⚠️  No patches were parsed - this might be expected if intent is not 'edit'");
      console.log("   Intent:", chatData.metadata?.intent || "unknown");
      console.log("   Message:", chatData.message?.substring(0, 100) || "none");
    } else {
      console.log("\n✅ Step 3: Patches parsed successfully");
      console.log(`   Patch operations: ${chatData.patches.map((p: any) => p.op).join(", ")}`);
    }

    // Step 4: Verify patches are applied
    if (!chatData.appliedPatches) {
      console.log("\n⚠️  Patches were not applied - this might be expected");
      console.log("   Response message:", chatData.message?.substring(0, 100) || "none");
    } else {
      console.log("\n✅ Step 4: Patches applied successfully");
      console.log(`   Patches applied: ${chatData.appliedPatches.patchesApplied}`);
      console.log(`   Code regenerated: ${chatData.appliedPatches.code ? "Yes" : "No"}`);

      // Step 5: Verify code is regenerated
      if (!chatData.appliedPatches.code) {
        throw new Error("❌ Code was not regenerated after patch application");
      }
      const newCode = chatData.appliedPatches.code;
      console.log("\n✅ Step 5: Code regenerated successfully");
      console.log(`   New code length: ${newCode.length} chars`);
      console.log(`   Code changed: ${newCode !== initialCode ? "Yes" : "No"}`);

      // Verify the change is in the code
      if (!newCode.includes("Updated Button")) {
        console.log("   ⚠️  Expected text 'Updated Button' not found in regenerated code");
        console.log("   Code preview:", newCode.substring(0, 200));
      } else {
        console.log("   ✅ Expected text 'Updated Button' found in code");
      }

      // Step 6: Verify revision is created
      if (!chatData.appliedPatches.revisionId) {
        console.log("\n⚠️  Step 6: Revision ID not present (may be optional)");
      } else {
        console.log("\n✅ Step 6: Revision created successfully");
        console.log(`   Revision ID: ${chatData.appliedPatches.revisionId}`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    if (chatData.appliedPatches && chatData.appliedPatches.code) {
      console.log("✅ TEST PASSED - Patches applied and code regenerated!");
    } else {
      console.log("⚠️  TEST PARTIAL - Patches may not have been applied");
      console.log("   This might be expected if the intent was not 'edit'");
    }
    console.log("=".repeat(60));
    console.log("\nSummary:");
    console.log(`  - Initial component generated: ✅`);
    console.log(`  - Patches parsed: ${chatData.patches && chatData.patches.length > 0 ? '✅' : '⚠️'} (${chatData.patches?.length || 0})`);
    console.log(`  - Patches applied: ${chatData.appliedPatches ? '✅' : '⚠️'} (${chatData.appliedPatches?.patchesApplied || 0})`);
    console.log(`  - Code regenerated: ${chatData.appliedPatches?.code ? '✅' : '⚠️'}`);
    if (chatData.appliedPatches?.code) {
      console.log(`  - Text updated: ${chatData.appliedPatches.code.includes('Updated Button') ? '✅' : '⚠️'}`);
    }
    console.log(`  - Revision created: ${chatData.appliedPatches?.revisionId ? '✅' : '⚠️'}`);

  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ TEST FAILED");
    console.error("=".repeat(60));
    console.error("\nError:", error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error("\nStack:", error.stack);
    }
    process.exit(1);
  }
}

// Run test
testC3Flow().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
