/**
 * Test C3: Patch Application + Regeneration
 * 
 * Tests the full patch workflow:
 * 1. Parse patches from natural language
 * 2. Apply patches to DSL
 * 3. Regenerate code
 * 4. Update session
 */

async function testC3() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
  console.log("🧪 Testing C3: Patch Application + Regeneration\n");

  // Test 1: Full workflow - Chat → Parse → Apply → Regenerate
  console.log("1️⃣ Testing Full Patch Workflow...");
  try {
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

    // Step 1: Chat with edit intent
    const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "change variant to outline",
        sessionId: "test-c3-session",
        context: { dsl: testDSL },
      }),
    });

    if (chatResponse.ok) {
      const chatResult = await chatResponse.json();
      console.log("   ✓ Intent:", chatResult.intent);
      console.log("   ✓ Patches parsed:", chatResult.patches?.length || 0);
      console.log("   ✓ Patches applied:", chatResult.appliedPatches ? "✅" : "❌");
      
      if (chatResult.appliedPatches) {
        console.log("   ✓ New DSL generated:", chatResult.appliedPatches.dsl ? "✅" : "❌");
        console.log("   ✓ New code generated:", chatResult.appliedPatches.code ? "✅" : "❌");
        console.log("   ✓ Patches applied count:", chatResult.appliedPatches.patchesApplied);
        
        // Verify patch was applied
        const newDSL = chatResult.appliedPatches.dsl;
        const button = newDSL.children.find((c: any) => c.id === "button-1");
        if (button && button.props?.variant === "outline") {
          console.log("   ✓ Patch verified: variant changed to outline ✅");
        } else {
          console.log("   ⚠️  Patch verification: variant not changed as expected");
        }
      }
    } else {
      console.log("   ❌ Chat API error:", chatResponse.status);
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  // Test 2: Direct patch application via apply-patches endpoint
  console.log("2️⃣ Testing Direct Patch Application...");
  try {
    const testDSL = {
      type: "page",
      id: "test-page",
      children: [
        {
          type: "component",
          id: "button-1",
          component: "Button",
          props: { variant: "solid" },
          copy: "Click",
        },
      ],
    };

    const patches = [
      {
        targetId: "button-1",
        op: "setProp",
        args: {
          path: "props.variant",
          value: "outline",
        },
      },
    ];

    const response = await fetch(`${BASE_URL}/api/chat/apply-patches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "test-c3-direct",
        patches,
        dsl: testDSL,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("   ✓ Patches applied:", result.patchesApplied || result.metadata?.patchesApplied);
      console.log("   ✓ New DSL generated:", result.dsl ? "✅" : "❌");
      console.log("   ✓ New code generated:", result.code ? "✅" : "❌");
      console.log("   ✓ Diagnostics:", result.diagnostics?.length || 0);
      
      // Verify patch
      const button = result.dsl.children.find((c: any) => c.id === "button-1");
      if (button && button.props?.variant === "outline") {
        console.log("   ✓ Patch verified: variant changed ✅");
      }
    } else {
      const error = await response.json();
      console.log("   ❌ Error:", error.error || response.status);
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  // Test 3: Multiple patches
  console.log("3️⃣ Testing Multiple Patches...");
  try {
    const testDSL = {
      type: "page",
      id: "test-page",
      children: [
        {
          type: "component",
          id: "button-1",
          component: "Button",
          props: { variant: "solid", size: "md" },
          copy: "Click",
        },
      ],
    };

    const patches = [
      {
        targetId: "button-1",
        op: "setProp",
        args: { path: "props.variant", value: "outline" },
      },
      {
        targetId: "button-1",
        op: "setCopy",
        args: { value: "Save" },
      },
    ];

    const response = await fetch(`${BASE_URL}/api/chat/apply-patches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "test-c3-multiple",
        patches,
        dsl: testDSL,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("   ✓ Multiple patches applied:", result.metadata?.patchesApplied);
      const button = result.dsl.children.find((c: any) => c.id === "button-1");
      if (button) {
        console.log("   ✓ Variant:", button.props?.variant);
        console.log("   ✓ Copy:", button.copy);
        if (button.props?.variant === "outline" && button.copy === "Save") {
          console.log("   ✓ All patches verified ✅");
        }
      }
    }
  } catch (error) {
    console.log("   ❌ Error:", error instanceof Error ? error.message : String(error));
  }
  console.log();

  console.log("✅ C3 tests completed!\n");
}

testC3().catch(console.error);

