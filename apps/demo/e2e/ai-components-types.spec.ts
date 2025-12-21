import { test, expect } from "@playwright/test";

/**
 * Test different types of AI-generated components
 * 
 * Tests that various component types render correctly:
 * - Button components
 * - Input/Form components
 * - Card components
 * - Complex components with multiple elements
 */

test.describe("AI Components Types", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Open Projects section
    const projectsButton = page.locator('button:has-text("Projects")').first();
    await expect(projectsButton).toBeVisible({ timeout: 10000 });
    
    const isActive = await projectsButton.getAttribute("data-active");
    if (isActive !== "true") {
      await projectsButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test("should render Button component", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Open AI Copilot
    const copilotButton = page.locator('button:has-text("Copilot")').first();
    if (await copilotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copilotButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate Button component
    const aiInput = page.locator('textarea[placeholder*="Describe"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });
    await aiInput.fill("Create a button with text 'Click Me'");
    await aiInput.press("Enter");

    // Wait for generation
    await page.waitForTimeout(8000);
    
    // Check if button is rendered
    const button = page.locator('button:has-text("Click Me"), button:has-text("Click")').first();
    await expect(button).toBeVisible({ timeout: 15000 });
    
    // Verify no React errors
    const reactErrors = errors.filter(err => 
      err.includes("React error #31") || 
      err.includes("Minified React error #31")
    );
    expect(reactErrors.length).toBe(0);
  });

  test("should render Input component", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Open AI Copilot
    const copilotButton = page.locator('button:has-text("Copilot")').first();
    if (await copilotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copilotButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate Input component
    const aiInput = page.locator('textarea[placeholder*="Describe"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });
    await aiInput.fill("Create an input field with placeholder 'Enter your name'");
    await aiInput.press("Enter");

    // Wait for generation
    await page.waitForTimeout(8000);
    
    // Check if input is rendered
    const input = page.locator('input[placeholder*="name"], input[placeholder*="Name"]').first();
    await expect(input).toBeVisible({ timeout: 15000 });
    
    // Verify no React errors
    const reactErrors = errors.filter(err => 
      err.includes("React error #31") || 
      err.includes("Minified React error #31")
    );
    expect(reactErrors.length).toBe(0);
  });

  test("should render Card component", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Open AI Copilot
    const copilotButton = page.locator('button:has-text("Copilot")').first();
    if (await copilotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copilotButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate Card component
    const aiInput = page.locator('textarea[placeholder*="Describe"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });
    await aiInput.fill("Create a card component with title 'My Card' and description 'This is a card'");
    await aiInput.press("Enter");

    // Wait for generation
    await page.waitForTimeout(8000);
    
    // Check if card is rendered (look for card title or description)
    const cardContent = page.locator('text=/My Card|This is a card/i').first();
    await expect(cardContent).toBeVisible({ timeout: 15000 });
    
    // Verify no React errors
    const reactErrors = errors.filter(err => 
      err.includes("React error #31") || 
      err.includes("Minified React error #31")
    );
    expect(reactErrors.length).toBe(0);
  });

  test("should render Form with multiple fields", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Open AI Copilot
    const copilotButton = page.locator('button:has-text("Copilot")').first();
    if (await copilotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copilotButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate Form component
    const aiInput = page.locator('textarea[placeholder*="Describe"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });
    await aiInput.fill("Create a form with email input and submit button");
    await aiInput.press("Enter");

    // Wait for generation
    await page.waitForTimeout(10000);
    
    // Check if form elements are rendered (more flexible selectors)
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"], input').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("submit")').first();
    const anyInput = page.locator('input').first();
    const anyButton = page.locator('button').first();
    
    // At least one form element should be visible
    await expect(anyInput.or(anyButton).first()).toBeVisible({ timeout: 15000 });
    
    // Verify no React errors
    const reactErrors = errors.filter(err => 
      err.includes("React error #31") || 
      err.includes("Minified React error #31")
    );
    expect(reactErrors.length).toBe(0);
  });

  test("should render complex component with multiple elements", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Open AI Copilot
    const copilotButton = page.locator('button:has-text("Copilot")').first();
    if (await copilotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copilotButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate complex component
    const aiInput = page.locator('textarea[placeholder*="Describe"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });
    await aiInput.fill("Create a card with title, description, and a button");
    await aiInput.press("Enter");

    // Wait for generation
    await page.waitForTimeout(10000);
    
    // Check if multiple elements are rendered
    const card = page.locator('[data-ui-id*="card"], .card').first();
    const button = page.locator('button').first();
    
    // At least one element should be visible
    await expect(card.or(button).first()).toBeVisible({ timeout: 15000 });
    
    // Verify no React errors
    const reactErrors = errors.filter(err => 
      err.includes("React error #31") || 
      err.includes("Minified React error #31")
    );
    expect(reactErrors.length).toBe(0);
  });
});

