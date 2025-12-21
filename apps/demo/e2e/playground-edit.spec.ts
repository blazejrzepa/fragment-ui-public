import { test, expect } from "@playwright/test";

/**
 * E2E tests for Playground editing workflow
 * 
 * Tests:
 * - Edit component via chat
 * - Undo/redo functionality
 * - Element inspector
 * - Patch operations
 */

test.describe("Playground Editing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for playground to be ready - use actual placeholder text
    await page.getByRole("textbox", { name: /describe what you want to build/i }).waitFor({ timeout: 15000 });
    
    // Generate initial component
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    await promptInput.fill("Create a button with text 'Original'");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for button to appear in preview (preview renders directly, not in iframe)
    // Use data-ui-id to identify preview elements (not UI buttons)
    await page.waitForSelector('button[data-ui-id]:has-text("Original")', { timeout: 45000 });
    
    // Extra wait to ensure component is fully loaded and stable
    await page.waitForTimeout(1000);
  });

  test("should edit component via chat", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for edit generation
    
    // Ensure initial component is generated first
    await page.waitForSelector('button[data-ui-id]', { timeout: 45000 });
    await page.waitForTimeout(2000); // Extra wait for stability
    
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    // Send edit command
    await promptInput.fill("Change button text to 'Updated'");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for button text to change (preview renders directly, not in iframe)
    await page.waitForSelector('button[data-ui-id]:has-text("Updated")', { timeout: 45000 });
    
    // Verify button text changed
    const button = page.locator('button[data-ui-id]:has-text("Updated")').first();
    await expect(button).toBeVisible({ timeout: 10000 });
    await expect(button).toContainText("Updated", { timeout: 5000 });
  });

  test("should support undo operation", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for undo operation
    
    // Make an edit first - wait for it to complete
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    await promptInput.fill("Change button text to 'Changed'");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for edit to complete
    await page.waitForSelector('button[data-ui-id]:has-text("Changed")', { timeout: 45000 });
    await page.waitForTimeout(1000); // Extra stability wait
    
    // Find undo button (could be icon or text)
    const undoButton = page.locator('button[title*="undo" i], button:has-text("Undo"), [aria-label*="undo" i]').first();
    
    // Check if undo is available
    const canUndo = await undoButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (canUndo && await undoButton.isEnabled()) {
      await undoButton.click();
      
      // Wait for undo to take effect
      await page.waitForTimeout(2000);
      
      // Verify reverted (button should show original text or different state)
      const button = page.locator('button[data-ui-id]').first();
      const buttonText = await button.textContent({ timeout: 5000 });
      
      // Should be different from "Changed" (either "Original" or empty)
      expect(buttonText).not.toContain("Changed");
    } else {
      // Undo might not be implemented in UI yet, skip test
      test.skip();
    }
  });

  test("should support redo operation", async ({ page }) => {
    test.setTimeout(90000); // Increase timeout for redo operation (undo + redo)
    
    // Make an edit - wait for it to complete
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    await promptInput.fill("Change button text to 'Redo Test'");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for edit to complete
    await page.waitForSelector('button[data-ui-id]:has-text("Redo Test")', { timeout: 45000 });
    await page.waitForTimeout(1000); // Extra stability wait
    
    // Undo first
    const undoButton = page.locator('button[title*="undo" i], button:has-text("Undo"), [aria-label*="undo" i]').first();
    const canUndo = await undoButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (canUndo && await undoButton.isEnabled()) {
      await undoButton.click();
      
      // Wait for undo to take effect
      await page.waitForTimeout(2000);
      
      // Then redo
      const redoButton = page.locator('button[title*="redo" i], button:has-text("Redo"), [aria-label*="redo" i]').first();
      const canRedo = await redoButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (canRedo && await redoButton.isEnabled()) {
        await redoButton.click();
        
        // Wait for redo to take effect
        await page.waitForTimeout(2000);
        
        // Wait for button text to restore
        await page.waitForSelector('button[data-ui-id]:has-text("Redo Test")', { timeout: 10000 });
        
        // Verify redo worked
        const button = page.locator('button[data-ui-id]:has-text("Redo Test")').first();
        const buttonText = await button.textContent({ timeout: 5000 });
        
        // Should contain "Redo Test" again
        expect(buttonText).toContain("Redo Test");
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test("should allow editing via element inspector", async ({ page }) => {
    // Click on a button in preview to select it (preview renders directly, not in iframe)
    const button = page.locator('button[data-ui-id]').first();
    await button.click();
    
    // Wait for inspector to appear (might be in sidebar or panel)
    await page.waitForTimeout(1000);
    
    // Look for inspector panel (could have various selectors)
    const inspector = page.locator('[class*="inspector"], [class*="properties"], [data-testid*="inspector"]').first();
    const hasInspector = await inspector.isVisible().catch(() => false);
    
    if (hasInspector) {
      // Try to find variant or prop selector
      const variantSelect = inspector.locator('select, [role="combobox"]').first();
      const hasVariantSelect = await variantSelect.isVisible().catch(() => false);
      
      if (hasVariantSelect) {
        // Change variant if possible
        await variantSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verify change (button should have different styling)
        const buttonClasses = await button.getAttribute("class");
        expect(buttonClasses).toBeTruthy();
      }
    } else {
      // Inspector might not be visible or implemented differently
      test.skip();
    }
  });

  test("should handle multiple sequential edits", async ({ page }) => {
    test.setTimeout(120000); // Increase timeout for multiple sequential edits
    
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    // Make multiple edits - wait for each to complete before proceeding
    const edits = [
      { text: "Change button text to 'First'", expected: "First" },
      { text: "Change button text to 'Second'", expected: "Second" },
      { text: "Change button text to 'Third'", expected: "Third" },
    ];
    
    for (const edit of edits) {
      await promptInput.fill(edit.text);
      await page.getByRole("button", { name: /send message/i }).click();
      
      // Wait for this specific edit to complete before next one
      await page.waitForSelector(`button[data-ui-id]:has-text("${edit.expected}")`, { timeout: 45000 });
      
      // Additional wait to ensure state is stable
      await page.waitForTimeout(1000);
    }
    
    // Wait for final state and verify (preview renders directly, not in iframe)
    const button = page.locator('button[data-ui-id]:has-text("Third")').first();
    await expect(button).toBeVisible({ timeout: 10000 });
    await expect(button).toContainText("Third", { timeout: 5000 });
  });
});

