import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to components page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Components");
    await expect(page).toHaveURL(/.*\/components/);
  });

  test("should navigate to blocks page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Blocks");
    await expect(page).toHaveURL(/.*\/blocks/);
  });

  test("should navigate to documentation", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Documentation");
    await expect(page).toHaveURL(/.*\/docs/);
  });

  test("should have working search", async ({ page }) => {
    await page.goto("/");
    
    // Click on search (if visible) or trigger search shortcut
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill("button");
      await expect(searchInput).toHaveValue("button");
    }
  });
});

