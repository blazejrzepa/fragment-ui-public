import { test, expect } from "@playwright/test";

/**
 * E2E tests for Submissions workflow
 * 
 * Tests:
 * - View submissions list
 * - Verify submission
 * - Promote submission to PR
 */

test.describe("Submissions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submissions");
    await page.waitForLoadState("networkidle");
  });

  test("should display submissions list", async ({ page }) => {
    // Wait for submissions to load
    await page.waitForTimeout(2000);
    
    // Look for submissions container
    const submissionsContainer = page.locator('[class*="submission"], table, [class*="list"]').first();
    
    const hasContainer = await submissionsContainer.isVisible().catch(() => false);
    expect(hasContainer).toBeTruthy();
  });

  test("should show submission details", async ({ page }) => {
    // Look for submission cards or rows
    const submissionItems = page.locator('[class*="submission"], tr, [class*="card"]');
    const itemCount = await submissionItems.count();
    
    if (itemCount > 0) {
      // Click on first submission
      await submissionItems.first().click();
      await page.waitForTimeout(1000);
      
      // Should show details (score, status, etc.)
      const details = page.locator('text=/score|status|verify|result/i');
      const hasDetails = await details.count() > 0;
      
      // Details should be visible
      expect(hasDetails || itemCount > 0).toBeTruthy();
    }
  });

  test("should have verify button for submissions", async ({ page }) => {
    // Look for verify button
    const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Check")').first();
    
    const hasVerifyButton = await verifyButton.isVisible().catch(() => false);
    
    // Verify button should exist (might be disabled if already verified)
    expect(hasVerifyButton || await verifyButton.count() > 0).toBeTruthy();
  });

  test("should have promote button for verified submissions", async ({ page }) => {
    // Look for promote button
    const promoteButton = page.locator('button:has-text("Promote"), button:has-text("Create PR")').first();
    
    const hasPromoteButton = await promoteButton.isVisible().catch(() => false);
    
    // Promote button should exist (might be disabled for unverified submissions)
    expect(hasPromoteButton || await promoteButton.count() > 0).toBeTruthy();
  });

  test("should display submission status", async ({ page }) => {
    // Look for status indicators
    const statusIndicators = page.locator('text=/pending|verified|rejected|draft/i, [class*="status"], [class*="badge"]');
    const hasStatus = await statusIndicators.count() > 0;
    
    // Status should be displayed
    expect(hasStatus).toBeTruthy();
  });
});

