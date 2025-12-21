import { test, expect } from "@playwright/test";

/**
 * Debug test to check what's actually on the playground page
 */
test.describe("Debug Playground", () => {
  test("should debug playground page structure", async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait a bit for page to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: "debug-playground.png", fullPage: true });
    
    // Check for Copilot tab
    const copilotTab = page.locator('button:has-text("Copilot"), [role="tab"]:has-text("Copilot")');
    const copilotCount = await copilotTab.count();
    console.log(`Copilot tab count: ${copilotCount}`);
    
    if (copilotCount > 0) {
      const isVisible = await copilotTab.first().isVisible();
      console.log(`Copilot tab visible: ${isVisible}`);
      
      if (!isVisible) {
        // Try to click it anyway
        await copilotTab.first().click({ force: true });
        await page.waitForTimeout(1000);
      } else {
        await copilotTab.first().click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Check for textarea
    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();
    console.log(`Textarea count: ${textareaCount}`);
    
    for (let i = 0; i < textareaCount; i++) {
      const textarea = textareas.nth(i);
      const placeholder = await textarea.getAttribute('placeholder');
      const isVisible = await textarea.isVisible();
      const isEnabled = await textarea.isEnabled();
      console.log(`Textarea ${i}: placeholder="${placeholder}", visible=${isVisible}, enabled=${isEnabled}`);
    }
    
    // Check for textarea with Describe placeholder
    const describeTextarea = page.locator('textarea[placeholder*="Describe"]');
    const describeCount = await describeTextarea.count();
    console.log(`Textarea with "Describe" placeholder count: ${describeCount}`);
    
    if (describeCount > 0) {
      const isVisible = await describeTextarea.first().isVisible();
      console.log(`Describe textarea visible: ${isVisible}`);
    }
    
    // Check for all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`Total button count: ${buttonCount}`);
    
    // Check for Send button
    const sendButtons = page.locator('button:has-text("Send"), button:has-text("Generate")');
    const sendCount = await sendButtons.count();
    console.log(`Send/Generate button count: ${sendCount}`);
    
    // Log page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Log URL
    const url = page.url();
    console.log(`Page URL: ${url}`);
  });
});

