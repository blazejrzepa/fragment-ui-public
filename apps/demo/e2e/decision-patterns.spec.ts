import { test, expect } from "@playwright/test";

test.describe("Decision Patterns - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for prompt input
    await page.waitForSelector(
      'textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea',
      { timeout: 10000 }
    );
  });

  test("should generate compare-3 decision pattern", async ({ page }) => {
    const promptInput = page
      .locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea')
      .first();
    
    await promptInput.fill(
      "Create a pricing page with 3 plans: Starter ($9/month), Pro ($29/month), and Enterprise ($99/month). Include comparison matrix."
    );
    
    await page
      .locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")')
      .first()
      .click();
    
    // Wait for generation to complete
    await page.waitForTimeout(5000);
    
    // Check if code was generated (look for Compare3 import or decision pattern)
    const codeView = page.locator('pre, code, [data-testid="code-view"]').first();
    await expect(codeView).toBeVisible({ timeout: 15000 });
    
    // Check if preview renders (look for decision pattern elements)
    const preview = page.locator('[data-section-role="decision-compare-3"]');
    await expect(preview).toBeVisible({ timeout: 15000 });
    
    // Check if ACL attributes are present
    const option1 = page.locator('[data-option-id]').first();
    await expect(option1).toBeVisible();
    
    // Check if comparison matrix is present
    const comparisonTable = page.locator('table').first();
    await expect(comparisonTable).toBeVisible();
  });

  test("should generate recommendation decision pattern", async ({ page }) => {
    const promptInput = page
      .locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea')
      .first();
    
    await promptInput.fill(
      "Create a recommendation page with 3 ranked options: Pro Plan (rank 1, 95% match), Enterprise (rank 2, 85% match), Starter (rank 3, 70% match). Include reasoning for each."
    );
    
    await page
      .locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")')
      .first()
      .click();
    
    await page.waitForTimeout(5000);
    
    // Check if recommendation pattern is rendered
    const preview = page.locator('[data-section-role="decision-recommendation"]');
    await expect(preview).toBeVisible({ timeout: 15000 });
    
    // Check if ranked options are present
    const rankedOption = page.locator('[data-rank="1"]');
    await expect(rankedOption).toBeVisible();
  });

  test("should generate tradeoffs decision pattern", async ({ page }) => {
    const promptInput = page
      .locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea')
      .first();
    
    await promptInput.fill(
      "Create a tradeoffs comparison page with 3 options showing cost, risk, and time dimensions. Option 1: High cost (80%), Low risk (30%), Fast (20%). Option 2: Medium cost (50%), Medium risk (50%), Medium time (50%). Option 3: Low cost (20%), High risk (60%), Slow (80%)."
    );
    
    await page
      .locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")')
      .first()
      .click();
    
    await page.waitForTimeout(5000);
    
    // Check if tradeoffs pattern is rendered
    const preview = page.locator('[data-section-role="decision-tradeoffs"]');
    await expect(preview).toBeVisible({ timeout: 15000 });
    
    // Check if dimensions are present
    const costDimension = page.locator('[data-dimension="cost"]');
    await expect(costDimension).toBeVisible();
  });

  test("should generate review-confirm decision pattern", async ({ page }) => {
    const promptInput = page
      .locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea')
      .first();
    
    await promptInput.fill(
      "Create a review and confirm page for order checkout. Show plan: Pro Plan, price: $29/month, billing: Monthly, payment method: Credit Card ending in 1234. Include confirm and cancel buttons."
    );
    
    await page
      .locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")')
      .first()
      .click();
    
    await page.waitForTimeout(5000);
    
    // Check if review-confirm pattern is rendered
    const preview = page.locator('[data-section-role="decision-review-confirm"]');
    await expect(preview).toBeVisible({ timeout: 15000 });
    
    // Check if hard action is present (requires confirmation)
    const confirmButton = page.locator('[data-action-kind="hard"]');
    await expect(confirmButton).toBeVisible();
    
    // Check if confirmation is required
    const requiresConfirmation = page.locator('[data-action-requires-confirmation="true"]');
    await expect(requiresConfirmation).toBeVisible();
  });

  test("should have ACL attributes on decision patterns", async ({ page }) => {
    // Generate any decision pattern
    const promptInput = page
      .locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea')
      .first();
    
    await promptInput.fill("Create a pricing page with 3 plans comparison");
    
    await page
      .locator('button[aria-label="Send message"], button[aria-label*="Send"], button:has-text("Send")')
      .first()
      .click();
    
    await page.waitForTimeout(5000);
    
    // Check for section role (any decision pattern)
    const sectionRole = page.locator('[data-section-role^="decision-"]');
    await expect(sectionRole).toBeVisible({ timeout: 15000 });
    
    // Check for option IDs
    const optionId = page.locator('[data-option-id]');
    await expect(optionId.first()).toBeVisible();
  });
});

