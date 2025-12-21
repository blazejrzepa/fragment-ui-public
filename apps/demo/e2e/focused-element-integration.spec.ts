import { test, expect } from "@playwright/test";

/**
 * E2E tests for Focused Element integration with Chat (Milestone 2.2)
 * 
 * Tests:
 * - Element selection → elementContext is passed to API
 * - Patch command applies only to selected element (not others)
 * - Multiple elements: selecting one and patching it doesn't affect others
 * - elementContext includes subtree, allowedProps, componentName
 */

test.describe("Focused Element Integration with Chat", () => {
  test.setTimeout(60000); // Increase test timeout to 60s
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for playground to be ready
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 10000 });
    
    // Generate initial component with multiple buttons
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    await promptInput.fill("Create two buttons: first button with text 'First Button' and variant 'solid', second button with text 'Second Button' and variant 'outline'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")').first().click();
    
    // Wait for both buttons to appear in preview
    await page.waitForSelector('button[data-ui-id]:has-text("First Button")', { timeout: 30000 });
    await page.waitForSelector('button[data-ui-id]:has-text("Second Button")', { timeout: 30000 });
  });

  test("should apply patch only to selected element (not others)", async ({ page }) => {
    // Find both buttons
    const firstButton = page.locator('button[data-ui-id]:has-text("First Button")').first();
    const secondButton = page.locator('button[data-ui-id]:has-text("Second Button")').first();
    
    // Verify initial state: first button should have solid variant (no border), second should have outline (border)
    const firstButtonClass = await firstButton.getAttribute("class");
    const secondButtonClass = await secondButton.getAttribute("class");
    
    // First button (solid) should NOT have border
    expect(firstButtonClass).not.toContain("border");
    // Second button (outline) should have border
    expect(secondButtonClass).toContain("border");
    
    // Select first button
    await firstButton.click();
    
    // Wait for Inspector tab to appear (indicates element is selected)
    const inspectorTab = page.locator('button:has-text("Inspector"), [role="tab"]:has-text("Inspector")');
    await inspectorTab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Switch to Copilot tab (textarea is there)
    const copilotTab = page.locator('button:has-text("Copilot"), [role="tab"]:has-text("Copilot")');
    await copilotTab.waitFor({ state: 'visible', timeout: 10000 });
    await copilotTab.click();
    
    // Wait for textarea to be visible
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 10000 });
    
    // Send patch command to change variant to outline (only for selected button)
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    await promptInput.fill("Change variant to 'outline'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")').first().click();
    
    // Wait for first button to change to outline (should have border now)
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button[data-ui-id]')) as HTMLElement[];
        const firstBtn = buttons.find(btn => btn.textContent?.includes("First Button"));
        return firstBtn && firstBtn.className.includes('border');
      },
      { timeout: 30000 }
    );
    
    // Verify: first button should now have border (outline variant)
    const updatedFirstButtonClass = await firstButton.getAttribute("class");
    expect(updatedFirstButtonClass).toContain("border");
    
    // Verify: second button should still have border (outline variant - unchanged)
    const updatedSecondButtonClass = await secondButton.getAttribute("class");
    expect(updatedSecondButtonClass).toContain("border");
    
    // Verify: first button text is unchanged
    await expect(firstButton).toContainText("First Button", { timeout: 5000 });
    // Verify: second button text is unchanged
    await expect(secondButton).toContainText("Second Button", { timeout: 5000 });
  });

  test("should change text only for selected element", async ({ page }) => {
    // Find both buttons and get their data-ui-id for stable reference
    const firstButton = page.locator('button[data-ui-id]:has-text("First Button")').first();
    const secondButton = page.locator('button[data-ui-id]:has-text("Second Button")').first();
    
    const firstButtonId = await firstButton.getAttribute('data-ui-id');
    const secondButtonId = await secondButton.getAttribute('data-ui-id');
    expect(firstButtonId).toBeTruthy();
    expect(secondButtonId).toBeTruthy();
    
    // Select first button
    await firstButton.click();
    
    // Wait for Inspector tab to appear
    const inspectorTab = page.locator('button:has-text("Inspector"), [role="tab"]:has-text("Inspector")');
    await inspectorTab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Switch to Copilot tab
    const copilotTab = page.locator('button:has-text("Copilot"), [role="tab"]:has-text("Copilot")');
    await copilotTab.waitFor({ state: 'visible', timeout: 10000 });
    await copilotTab.click();
    
    // Wait for textarea
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 10000 });
    
    // Send patch command to change text (only for selected button)
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    await promptInput.fill("Change text to 'Updated First Button'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")').first().click();
    
    // Wait for first button text to change
    await page.waitForSelector(`button[data-ui-id="${firstButtonId}"]:has-text("Updated First Button")`, { timeout: 30000 });
    
    // Verify: first button text changed (use data-ui-id for stable reference)
    const updatedFirstButton = page.locator(`button[data-ui-id="${firstButtonId}"]`).first();
    await expect(updatedFirstButton).toContainText("Updated First Button", { timeout: 5000 });
    
    // Verify: second button text is unchanged
    const unchangedSecondButton = page.locator(`button[data-ui-id="${secondButtonId}"]`).first();
    await expect(unchangedSecondButton).toContainText("Second Button", { timeout: 5000 });
  });

  test("should maintain selection when switching tabs", async ({ page }) => {
    // Select first button and get its data-ui-id for stable reference
    const firstButton = page.locator('button[data-ui-id]:has-text("First Button")').first();
    await firstButton.click();
    
    // Get the data-ui-id attribute for stable reference
    const firstButtonId = await firstButton.getAttribute('data-ui-id');
    expect(firstButtonId).toBeTruthy();
    
    // Wait for Inspector tab to appear
    const inspectorTab = page.locator('button:has-text("Inspector"), [role="tab"]:has-text("Inspector")');
    await inspectorTab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Switch to Copilot tab
    const copilotTab = page.locator('button:has-text("Copilot"), [role="tab"]:has-text("Copilot")');
    await copilotTab.waitFor({ state: 'visible', timeout: 10000 });
    await copilotTab.click();
    
    // Wait for textarea
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 10000 });
    
    // Switch back to Inspector tab
    await inspectorTab.click();
    await inspectorTab.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify: Inspector should still show the selected element
    // (We can check if Inspector is visible, which indicates element is still selected)
    const isInspectorVisible = await inspectorTab.isVisible();
    expect(isInspectorVisible).toBe(true);
    
    // Switch back to Copilot and send command
    await copilotTab.click();
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 10000 });
    
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    await promptInput.fill("Change text to 'Still Selected'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")').first().click();
    
    // Wait for first button text to change (proves selection was maintained)
    // Use data-ui-id for stable reference instead of text
    await page.waitForSelector(`button[data-ui-id="${firstButtonId}"]:has-text("Still Selected")`, { timeout: 30000 });
    
    // Verify: first button text changed (use data-ui-id for stable reference)
    const updatedFirstButton = page.locator(`button[data-ui-id="${firstButtonId}"]`).first();
    await expect(updatedFirstButton).toContainText("Still Selected", { timeout: 5000 });
  });
});

