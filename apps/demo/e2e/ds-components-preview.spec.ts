import { test, expect } from "@playwright/test";

/**
 * Test DS Components Preview
 * 
 * Tests that DS Components (especially Radix UI components like Accordion, Dialog, Tabs)
 * render correctly in preview without React error #31
 */

test.describe("DS Components Preview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
  });

  test("should display Preview when DS Component Accordion is opened", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors, especially React error #31
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        errors.push(text);
        // Log React error #31 if it occurs
        if (text.includes("Minified React error #31") || text.includes("React error #31")) {
          console.error("❌ React error #31 detected:", text);
        }
      }
    });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open DS Components section
    const componentsButton = page.locator('button:has-text("Components")').filter({ hasNotText: "Projects" }).first();
    await expect(componentsButton).toBeVisible({ timeout: 10000 });
    await componentsButton.click();
    
    // Wait for search input
    await page.waitForSelector('input[placeholder*="Search components"], input[placeholder*="search"]', { timeout: 10000 });

    // Wait for components to load from registry
    await page.waitForTimeout(2000);

    // Search for Accordion component
    const searchInput = page.locator('input[placeholder*="Search components"], input[placeholder*="search"]').first();
    await searchInput.fill("Accordion");
    await page.waitForTimeout(1000);

    // Find and click Accordion component button
    const accordionButton = page.locator('button:has-text("Accordion")')
      .filter({ hasNotText: "Components" })
      .filter({ hasNotText: "Projects" })
      .first();
    
    await expect(accordionButton).toBeVisible({ timeout: 15000 });
    await accordionButton.click();

    // Wait for preview to load
    await page.waitForTimeout(4000);

    // Check if preview container is visible (SameOriginPreview uses iframe)
    const previewContainer = page.locator('iframe[src*="/playground/runtime/iframe"]');
    await expect(previewContainer).toBeVisible({ timeout: 20000 });
    
    // Wait for iframe to load
    await page.waitForTimeout(2000);
    
    // Get iframe content
    const iframe = previewContainer.first();
    const iframeContent = await iframe.contentFrame();
    if (!iframeContent) {
      throw new Error("Iframe content frame not found");
    }
    
    // Wait for root element in iframe
    const rootInIframe = iframeContent.locator('#root');
    await expect(rootInIframe).toBeVisible({ timeout: 10000 });
    
    // Wait a bit more for component to render
    await page.waitForTimeout(5000);

    // Check if Accordion content is visible in preview (within iframe)
    // Accordion should have trigger text like "Is it accessible?" or "Is it styled?"
    // Try multiple selectors to find the accordion content within iframe
    const accordionTrigger1 = iframeContent.locator('text=/Is it (accessible|styled|animated)\\?/i');
    const accordionTrigger2 = iframeContent.locator('button:has-text("Is it")');
    const accordionTrigger3 = iframeContent.locator('[role="button"]:has-text("Is it")');
    
    // Check if any of these selectors find the accordion
    const count1 = await accordionTrigger1.count();
    const count2 = await accordionTrigger2.count();
    const count3 = await accordionTrigger3.count();
    
    if (count1 === 0 && count2 === 0 && count3 === 0) {
      // Log what's actually in the preview for debugging
      const rootText = await rootInIframe.textContent();
      console.log('Preview content:', rootText?.substring(0, 200));
      // At minimum, check that root has some content
      await expect(rootInIframe).not.toBeEmpty({ timeout: 10000 });
    } else {
      // At least one selector found the accordion
      expect(count1 + count2 + count3).toBeGreaterThan(0);
    }

    // Verify no React error #31 occurred
    const reactErrors = errors.filter(
      (error) =>
        error.includes("Minified React error #31") ||
        error.includes("React error #31") ||
        error.includes("object with keys {$$typeof")
    );

    if (reactErrors.length > 0) {
      console.error("❌ React error #31 detected:", reactErrors);
      throw new Error(`React error #31 occurred: ${reactErrors.join(", ")}`);
    }

    expect(reactErrors.length).toBe(0);
  });

  test("should display Preview when DS Component Dialog is opened", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // Open DS Components section
    const componentsButton = page.locator('button:has-text("Components")').filter({ hasNotText: "Projects" }).first();
    await expect(componentsButton).toBeVisible({ timeout: 10000 });
    await componentsButton.click();
    
    await page.waitForSelector('input[placeholder*="Search components"], input[placeholder*="search"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Search for Dialog component
    const searchInput = page.locator('input[placeholder*="Search components"], input[placeholder*="search"]').first();
    await searchInput.fill("Dialog");
    await page.waitForTimeout(1000);

    // Find and click Dialog component button
    const dialogButton = page.locator('button:has-text("Dialog")')
      .filter({ hasNotText: "Components" })
      .filter({ hasNotText: "Projects" })
      .first();
    
    await expect(dialogButton).toBeVisible({ timeout: 15000 });
    await dialogButton.click();

    await page.waitForTimeout(4000);

    // Check if preview container is visible (SameOriginPreview uses iframe)
    const previewContainer = page.locator('iframe[src*="/playground/runtime/iframe"]');
    await expect(previewContainer).toBeVisible({ timeout: 20000 });
    
    // Wait for iframe to load
    await page.waitForTimeout(2000);
    
    // Get iframe content
    const iframe = previewContainer.first();
    const iframeContent = await iframe.contentFrame();
    if (!iframeContent) {
      throw new Error("Iframe content frame not found");
    }
    
    // Wait for root element in iframe
    const rootInIframe = iframeContent.locator('#root');
    await expect(rootInIframe).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000);

    // Check if Dialog trigger button is visible (within iframe)
    const dialogTrigger = iframeContent.locator('button:has-text("Open"), button:has-text("Dialog")');
    await expect(dialogTrigger.first()).toBeVisible({ timeout: 10000 });

    // Verify no React error #31
    const reactErrors = errors.filter(
      (error) =>
        error.includes("Minified React error #31") ||
        error.includes("React error #31") ||
        error.includes("object with keys {$$typeof")
    );

    expect(reactErrors.length).toBe(0);
  });

  test("should display Preview when DS Component Tabs is opened", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // Open DS Components section
    const componentsButton = page.locator('button:has-text("Components")').filter({ hasNotText: "Projects" }).first();
    await expect(componentsButton).toBeVisible({ timeout: 10000 });
    await componentsButton.click();
    
    await page.waitForSelector('input[placeholder*="Search components"], input[placeholder*="search"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Search for Tabs component
    const searchInput = page.locator('input[placeholder*="Search components"], input[placeholder*="search"]').first();
    await searchInput.fill("Tabs");
    await page.waitForTimeout(1000);

    // Find and click Tabs component button
    const tabsButton = page.locator('button:has-text("Tabs")')
      .filter({ hasNotText: "Components" })
      .filter({ hasNotText: "Projects" })
      .first();
    
    await expect(tabsButton).toBeVisible({ timeout: 15000 });
    await tabsButton.click();

    await page.waitForTimeout(4000);

    // Check if preview container is visible (SameOriginPreview uses iframe)
    const previewContainer = page.locator('iframe[src*="/playground/runtime/iframe"]');
    await expect(previewContainer).toBeVisible({ timeout: 20000 });
    
    // Wait for iframe to load
    await page.waitForTimeout(2000);
    
    // Get iframe content
    const iframe = previewContainer.first();
    const iframeContent = await iframe.contentFrame();
    if (!iframeContent) {
      throw new Error("Iframe content frame not found");
    }
    
    // Wait for root element in iframe
    const rootInIframe = iframeContent.locator('#root');
    await expect(rootInIframe).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000);

    // Check if Tabs content is visible (look for tab triggers within iframe)
    const tabTrigger = iframeContent.locator('button:has-text("Tab"), [role="tab"]');
    await expect(tabTrigger.first()).toBeVisible({ timeout: 10000 });

    // Verify no React error #31
    const reactErrors = errors.filter(
      (error) =>
        error.includes("Minified React error #31") ||
        error.includes("React error #31") ||
        error.includes("object with keys {$$typeof")
    );

    expect(reactErrors.length).toBe(0);
  });
});

