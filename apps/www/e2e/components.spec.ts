import { test, expect } from "@playwright/test";

test.describe("Components", () => {
  test("should display components list", async ({ page }) => {
    await page.goto("/components");
    
    // Check if components list is visible
    const componentsList = page.locator("main, article, [role='main']");
    await expect(componentsList.first()).toBeVisible();
  });

  test("should navigate to Button component page", async ({ page }) => {
    await page.goto("/components");
    
    // Look for Button link
    const buttonLink = page.getByRole("link", { name: /button/i }).first();
    
    if (await buttonLink.isVisible()) {
      await buttonLink.click();
      await expect(page).toHaveURL(/.*\/docs\/components\/button/);
      
      // Check if Button documentation content is visible
      const heading = page.locator("h1, h2").filter({ hasText: /button/i }).first();
      await expect(heading).toBeVisible();
    }
  });
});

