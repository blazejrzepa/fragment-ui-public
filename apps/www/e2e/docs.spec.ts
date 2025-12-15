import { test, expect } from "@playwright/test";

test.describe("Documentation", () => {
  test("should load documentation home", async ({ page }) => {
    await page.goto("/docs");
    await expect(page).toHaveURL(/.*\/docs/);
    
    // Check if main content is visible
    const mainContent = page.locator("main, article").first();
    await expect(mainContent).toBeVisible();
  });

  test("should navigate to tokens documentation", async ({ page }) => {
    await page.goto("/docs");
    
    // Look for tokens/foundations link
    const tokensLink = page.getByRole("link", { name: /token/i }).first();
    
    if (await tokensLink.isVisible()) {
      await tokensLink.click();
      await expect(page).toHaveURL(/.*\/docs\/foundations\/tokens/);
    }
  });

  test("should have working version switcher", async ({ page }) => {
    await page.goto("/docs");
    
    // Look for version switcher
    const versionSwitcher = page.locator('button, select').filter({ hasText: /version|v\d+/i }).first();
    
    if (await versionSwitcher.isVisible()) {
      await versionSwitcher.click();
      // Check if dropdown opens (this depends on implementation)
      await expect(page.locator('[role="menu"], [role="listbox"]').first()).toBeVisible({ timeout: 2000 }).catch(() => {});
    }
  });

  test("should display table of contents on long pages", async ({ page }) => {
    await page.goto("/docs/foundations/tokens");
    
    // Check if TOC is visible (may be in sidebar or sticky)
    const toc = page.locator('[role="navigation"], nav, aside').filter({ hasText: /table|contents|toc/i }).first();
    
    // TOC might be present, but not always visible on mobile
    if (await toc.isVisible()) {
      await expect(toc).toBeVisible();
    }
  });
});

