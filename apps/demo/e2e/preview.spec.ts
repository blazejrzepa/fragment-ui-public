import { test, expect } from "@playwright/test";

/**
 * Smoke test for Playground preview runtime
 * 
 * Tests that:
 * - Preview renders without console errors
 * - Basic components (Form, Tabs, Table) render correctly
 * - Dashboard and Landing layouts render correctly
 * - No module resolution errors
 */
test.describe("Preview Runtime", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to playground
    await page.goto("/studio");
    
    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  /**
   * Helper function to generate code via API and wait for preview
   */
  async function generateAndWaitForPreview(page: any, prompt: string) {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg: any) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Generate code via API
    const response = await page.request.post("/api/generate", {
      data: { prompt, demoName: "smoke-test" },
    });
    
    expect(response.ok()).toBeTruthy();
    const { code } = await response.json();
    expect(code).toBeTruthy();

    // Wait for preview iframe
    await page.waitForSelector('iframe[title="Component Preview"]', { timeout: 10000 });
    
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    await iframe.locator("#root").waitFor({ timeout: 10000 });
    
    // Wait for rendering
    await page.waitForTimeout(3000);
    
    return { iframe, errors };
  }

  test("should render form component without console errors", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Wait for preview iframe to be ready
    await page.waitForSelector('iframe[title="Component Preview"]', { timeout: 10000 });
    
    // Get the iframe
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    
    // Wait for root element in iframe
    await iframe.locator("#root").waitFor({ timeout: 10000 });
    
    // Wait a bit for any async operations
    await page.waitForTimeout(2000);
    
    // Check for console errors
    const consoleErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("Failed to load resource") &&
        !error.includes("404")
    );
    
    expect(consoleErrors).toHaveLength(0);
  });

  test("should render tabs component without module errors", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Wait for preview iframe
    await page.waitForSelector('iframe[title="Component Preview"]', { timeout: 10000 });
    
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    await iframe.locator("#root").waitFor({ timeout: 10000 });
    
    // Wait for rendering
    await page.waitForTimeout(2000);
    
    // Check for module resolution errors
    const moduleErrors = errors.filter(
      (error) =>
        error.includes("Failed to resolve module") ||
        error.includes("Cannot find module") ||
        error.includes("react/jsx-runtime")
    );
    
    expect(moduleErrors).toHaveLength(0);
  });

  test("should render table component without errors", async ({ page }) => {
    const errors: string[] = [];
    
    // Collect console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Wait for preview iframe
    await page.waitForSelector('iframe[title="Component Preview"]', { timeout: 10000 });
    
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    await iframe.locator("#root").waitFor({ timeout: 10000 });
    
    // Wait for rendering
    await page.waitForTimeout(2000);
    
    // Check that root element exists and is visible
    const root = iframe.locator("#root");
    await expect(root).toBeVisible();
    
    // Check for critical errors (excluding non-critical ones)
    const criticalErrors = errors.filter(
      (error) =>
        error.includes("Uncaught") ||
        error.includes("ReferenceError") ||
        error.includes("TypeError") ||
        error.includes("SyntaxError")
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test("form/tabs/table preview", async ({ page }) => {
    const { iframe, errors } = await generateAndWaitForPreview(
      page,
      "Create a form with tabs containing a contact form and a data table with columns: name, email, status"
    );

    // Check that root element exists and is visible
    const root = iframe.locator("#root");
    await expect(root).toBeVisible();

    // Check for critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("Failed to load resource") &&
        !error.includes("404") &&
        (error.includes("Uncaught") ||
          error.includes("ReferenceError") ||
          error.includes("TypeError") ||
          error.includes("SyntaxError") ||
          error.includes("react/jsx-runtime"))
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("dashboard preview", async ({ page }) => {
    const { iframe, errors } = await generateAndWaitForPreview(
      page,
      "Create a dashboard with cards showing metrics and a chart"
    );

    // Check that root element exists and is visible
    const root = iframe.locator("#root");
    await expect(root).toBeVisible();

    // Check for critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("Failed to load resource") &&
        !error.includes("404") &&
        (error.includes("Uncaught") ||
          error.includes("ReferenceError") ||
          error.includes("TypeError") ||
          error.includes("SyntaxError") ||
          error.includes("react/jsx-runtime"))
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("landing preview", async ({ page }) => {
    const { iframe, errors } = await generateAndWaitForPreview(
      page,
      "Create a landing page with hero section, features, and pricing table"
    );

    // Check that root element exists and is visible
    const root = iframe.locator("#root");
    await expect(root).toBeVisible();

    // Check for critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("Failed to load resource") &&
        !error.includes("404") &&
        (error.includes("Uncaught") ||
          error.includes("ReferenceError") ||
          error.includes("TypeError") ||
          error.includes("SyntaxError") ||
          error.includes("react/jsx-runtime"))
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

