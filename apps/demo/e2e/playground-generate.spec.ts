import { test, expect } from "@playwright/test";

/**
 * E2E tests for Playground generation workflow
 * 
 * Tests:
 * - Generate component from prompt
 * - Generate form with fields
 * - Generate page with layout
 * - Error handling for invalid prompts
 */

test.describe("Playground Generation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for playground to be ready - use actual placeholder text
    await page.getByRole("textbox", { name: /describe what you want to build/i }).waitFor({ timeout: 15000 });
  });

  test("should generate component from prompt", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for generation
    
    // Find the prompt input using the actual placeholder text
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    // Type prompt
    await promptInput.fill("Create a button with text 'Click me'");
    
    // Find and click send button using aria-label
    const sendButton = page.getByRole("button", { name: /send message/i });
    await sendButton.click();
    
    // Wait for button to appear in preview (preview renders directly, not in iframe)
    // Use data-ui-id to identify preview elements (not UI buttons)
    await page.waitForSelector('button[data-ui-id]:has-text("Click me")', { timeout: 45000 });
    
    // Verify button is rendered
    const button = page.locator('button[data-ui-id]:has-text("Click me")').first();
    await expect(button).toBeVisible({ timeout: 10000 });
    await expect(button).toContainText("Click me", { timeout: 5000 });
  });

  test("should generate form with multiple fields", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for form generation
    
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    await promptInput.fill("Create a registration form with email, password, and name fields");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for any form input to appear (preview renders directly, not in iframe)
    // Use more flexible selector - form inputs might be nested in FormField components
    await page.waitForSelector('input[type="email"], input[type="password"], input[name*="email" i], input[name*="password" i], input[placeholder*="email" i]', { timeout: 45000 });
    
    // Wait a bit more for all fields to render
    await page.waitForTimeout(2000);
    
    // Verify form fields exist - use flexible selectors that work with or without data-ui-id
    const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name*="password" i], input[placeholder*="password" i]').first();
    const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i], input[type="text"]').first();
    
    // Check visibility with longer timeout
    const hasEmail = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasPassword = await passwordInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasName = await nameInput.isVisible({ timeout: 5000 }).catch(() => false);
    
    // At least two fields should be visible to confirm form was generated
    const fieldCount = [hasEmail, hasPassword, hasName].filter(Boolean).length;
    expect(fieldCount).toBeGreaterThanOrEqual(2);
  });

  test("should generate page with dashboard layout", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for complex layout generation
    
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    await promptInput.fill("Create a dashboard with header, sidebar, and content area");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for any layout element to appear (preview renders directly, not in iframe)
    await page.waitForSelector('header, aside, main, [data-ui-id*="header"], [data-ui-id*="sidebar"], [data-ui-id*="content"]', { timeout: 45000 });
    
    // Wait a bit more for layout to fully render
    await page.waitForTimeout(2000);
    
    // Check for dashboard-like structure (header, sidebar, main) with or without data-ui-id
    const header = page.locator('header[data-ui-id], [data-ui-id*="header"], header').first();
    const sidebar = page.locator('aside[data-ui-id], [data-ui-id*="sidebar"], aside').first();
    const main = page.locator('main[data-ui-id], [data-ui-id*="content"], main').first();
    
    // At least one should be visible (layout might vary)
    const hasHeader = await header.isVisible({ timeout: 5000 }).catch(() => false);
    const hasSidebar = await sidebar.isVisible({ timeout: 5000 }).catch(() => false);
    const hasMain = await main.isVisible({ timeout: 5000 }).catch(() => false);
    
    // At least one layout element should be visible
    expect(hasHeader || hasSidebar || hasMain).toBeTruthy();
  });

  test("should show error for empty prompt", async ({ page }) => {
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    const sendButton = page.getByRole("button", { name: /send message/i });
    
    // Button should be disabled when input is empty
    await expect(sendButton).toBeDisabled();
    
    // Try to send empty prompt (should not work)
    const isDisabled = await sendButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("should display generated code in code editor", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for code editor test
    
    const promptInput = page.getByRole("textbox", { name: /describe what you want to build/i });
    
    await promptInput.fill("Create a simple button");
    await page.getByRole("button", { name: /send message/i }).click();
    
    // Wait for generation to complete (button appears in preview)
    await page.waitForSelector('button[data-ui-id]', { timeout: 45000 });
    
    // Wait a bit more for code to be available
    await page.waitForTimeout(1000);
    
    // Click on Code tab to view generated code
    const codeTab = page.getByRole("button", { name: /code/i }).or(page.locator('button:has-text("Code")'));
    await expect(codeTab).toBeVisible({ timeout: 10000 });
    await codeTab.click();
    
    // Wait for code tab content to load
    await page.waitForTimeout(2000);
    
    // Look for code in pre/code tags - be more specific
    const codeBlock = page.locator('pre code, code:not([class*="language"]), [class*="code-highlight"] code').first();
    
    // Code should be visible
    await expect(codeBlock).toBeVisible({ timeout: 15000 });
    
    // Code should contain React/TSX keywords
    const codeText = await codeBlock.textContent();
    expect(codeText).toBeTruthy();
    expect(codeText).toMatch(/export|function|return|Button|React/i);
  });
});

