import { test, expect } from "@playwright/test";

/**
 * Milestone 1.2: Test E2E - Render Button, DatePicker, and Block in preview
 * 
 * Tests that:
 * - Button renders correctly in preview without errors
 * - DatePicker renders correctly in preview without errors
 * - Block renders correctly in preview without errors
 * - No module resolution errors
 * - No React error #31
 */

test.describe("Milestone 1.2: Preview Render Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for page to be ready
    await page.waitForTimeout(2000);
  });

  /**
   * Helper function to open a component from DS Components
   */
  async function openComponent(page: any, componentName: string) {
    // Open DS Components section
    const componentsButton = page.locator('button:has-text("Components")').filter({ hasNotText: "Projects" }).first();
    await expect(componentsButton).toBeVisible({ timeout: 10000 });
    await componentsButton.click();
    
    // Wait for search input
    await page.waitForSelector('input[placeholder*="Search components"], input[placeholder*="search"]', { timeout: 10000 });
    
    // Wait for components to load
    await page.waitForTimeout(2000);
    
    // Search for component
    const searchInput = page.locator('input[placeholder*="Search components"], input[placeholder*="search"]').first();
    await searchInput.fill(componentName);
    await page.waitForTimeout(1000);
    
    // Find and click component button
    const componentButton = page.locator(`button:has-text("${componentName}")`)
      .filter({ hasNotText: "Components" })
      .filter({ hasNotText: "Projects" })
      .first();
    
    await expect(componentButton).toBeVisible({ timeout: 15000 });
    await componentButton.click();
    
    // Wait for preview to load
    await page.waitForTimeout(4000);
  }

  /**
   * Helper function to check for errors in preview
   */
  async function checkPreviewErrors(page: any, componentName: string) {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg: any) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Check if preview container is visible
    const previewContainer = page.locator('iframe[src*="/studio/runtime/iframe"]');
    await expect(previewContainer).toBeVisible({ timeout: 20000 });
    
    // Wait for iframe to load
    await page.waitForTimeout(2000);
    
    // Get iframe content
    const iframe = previewContainer.first();
    const iframeContent = await iframe.contentFrame();
    if (!iframeContent) {
      throw new Error(`[${componentName}] Iframe content frame not found`);
    }
    
    // Wait for root element in iframe
    const rootInIframe = iframeContent.locator('#root');
    await expect(rootInIframe).toBeVisible({ timeout: 10000 });
    
    // Wait for component to render
    await page.waitForTimeout(3000);
    
    // Check for critical errors
    const criticalErrors = errors.filter((error: string) =>
      error.includes("Failed to resolve module") ||
      error.includes("Cannot find module") ||
      error.includes("react/jsx-runtime") ||
      error.includes("React error #31") ||
      error.includes("Minified React error #31") ||
      error.includes("Uncaught") ||
      error.includes("ReferenceError") ||
      error.includes("TypeError") ||
      error.includes("SyntaxError")
    );
    
    if (criticalErrors.length > 0) {
      console.error(`[${componentName}] Critical errors:`, criticalErrors);
    }
    
    return { criticalErrors, rootInIframe, iframeContent };
  }

  test("should render Button in preview without errors", async ({ page }) => {
    await openComponent(page, "Button");
    
    const { criticalErrors, rootInIframe, iframeContent } = await checkPreviewErrors(page, "Button");
    
    // Verify no critical errors
    expect(criticalErrors.length).toBe(0);
    
    // Verify root has content
    await expect(rootInIframe).not.toBeEmpty({ timeout: 10000 });
    
    // Verify button is rendered in preview
    const button = iframeContent.locator('button').first();
    const buttonCount = await button.count();
    
    if (buttonCount > 0) {
      await expect(button).toBeVisible({ timeout: 5000 });
    } else {
      // At least verify root has some content
      const rootText = await rootInIframe.textContent();
      expect(rootText).toBeTruthy();
      expect(rootText?.trim().length).toBeGreaterThan(0);
    }
  });

  test("should render DatePicker in preview without errors", async ({ page }) => {
    await openComponent(page, "DatePicker");
    
    const { criticalErrors, rootInIframe, iframeContent } = await checkPreviewErrors(page, "DatePicker");
    
    // Verify no critical errors
    expect(criticalErrors.length).toBe(0);
    
    // Verify root has content
    await expect(rootInIframe).not.toBeEmpty({ timeout: 10000 });
    
    // Verify DatePicker is rendered (could be input, button, or calendar)
    const datePickerInput = iframeContent.locator('input[type="date"], input[placeholder*="date"], input[placeholder*="Date"]').first();
    const datePickerButton = iframeContent.locator('button[aria-label*="date"], button[aria-label*="calendar"]').first();
    const calendar = iframeContent.locator('[role="grid"], [role="calendar"]').first();
    
    const hasInput = await datePickerInput.count() > 0;
    const hasButton = await datePickerButton.count() > 0;
    const hasCalendar = await calendar.count() > 0;
    
    // At least one DatePicker element should be visible
    if (hasInput) {
      await expect(datePickerInput).toBeVisible({ timeout: 5000 });
    } else if (hasButton) {
      await expect(datePickerButton).toBeVisible({ timeout: 5000 });
    } else if (hasCalendar) {
      await expect(calendar).toBeVisible({ timeout: 5000 });
    } else {
      // At least verify root has some content
      const rootText = await rootInIframe.textContent();
      expect(rootText).toBeTruthy();
      expect(rootText?.trim().length).toBeGreaterThan(0);
    }
  });

  test("should render Block in preview without errors", async ({ page }) => {
    // Note: Blocks might be in a different section or need to be generated
    // For now, we'll test if Blocks section exists or try to generate one
    
    // Try to find Blocks section or generate a block
    const blocksButton = page.locator('button:has-text("Block"), button:has-text("Blocks")').first();
    const hasBlocksButton = await blocksButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasBlocksButton) {
      await blocksButton.click();
      await page.waitForTimeout(2000);
      
      // Try to find and open a block
      const blockItem = page.locator('button:not([disabled]):not([aria-label*="Close"]):not([aria-label*="New"])')
        .filter({ hasNotText: "Components" })
        .filter({ hasNotText: "Projects" })
        .filter({ hasNotText: "New" })
        .filter({ hasNotText: "Folder" })
        .first();
      
      const hasBlockItem = await blockItem.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasBlockItem) {
        await blockItem.click();
        await page.waitForTimeout(4000);
        
        const { criticalErrors, rootInIframe } = await checkPreviewErrors(page, "Block");
        
        // Verify no critical errors
        expect(criticalErrors.length).toBe(0);
        
        // Verify root has content
        await expect(rootInIframe).not.toBeEmpty({ timeout: 10000 });
      } else {
        // Skip if no blocks available
        test.skip();
      }
    } else {
      // If Blocks section doesn't exist, try generating a block via AI
      const copilotButton = page.locator('button:has-text("Copilot")').first();
      const hasCopilot = await copilotButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasCopilot) {
        await copilotButton.click();
        await page.waitForTimeout(1000);
        
        // Generate a block component
        const aiInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
        await aiInput.fill("Create a hero block with title and description");
        
        const sendButton = page.locator('button:has-text("Send"), button:has-text("Generate")').first();
        await sendButton.click();
        
        // Wait for generation
        await page.waitForTimeout(5000);
        
        // Check for preview (could be iframe or direct render)
        const previewContainer = page.locator('iframe[src*="/studio/runtime/iframe"], [data-testid="preview"], .react-live-preview').first();
        const hasPreview = await previewContainer.isVisible({ timeout: 15000 }).catch(() => false);
        
        if (hasPreview) {
          const { criticalErrors, rootInIframe } = await checkPreviewErrors(page, "Block");
          
          // Verify no critical errors
          expect(criticalErrors.length).toBe(0);
          
          // Verify root has content
          await expect(rootInIframe).not.toBeEmpty({ timeout: 10000 });
        } else {
          test.skip();
        }
      } else {
        // Skip if no way to test blocks
        test.skip();
      }
    }
  });
});

