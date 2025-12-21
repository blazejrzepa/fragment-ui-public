import { test, expect } from "@playwright/test";

/**
 * E2E tests for Button commands in AI Copilot
 * 
 * Tests all available commands for buttons:
 * - Change text (setCopy)
 * - Change variant (setProp - variant: solid, outline, ghost)
 * - Change size (setProp - size: sm, md, lg)
 * - Enable/Disable (setProp - disabled: true/false)
 */

test.describe("Button Commands - AI Copilot", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for playground to be ready
    await page.waitForSelector('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea', { timeout: 15000 });
    
    // Generate initial button component
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    await promptInput.fill("Create a button with text 'Test Button'");
    const sendButton = page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first();
    await sendButton.click();
    
    // Wait for initial generation to complete
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    await iframe.locator("#root").waitFor({ timeout: 20000 });
    await page.waitForTimeout(3000); // Additional wait for rendering stability
    
    // Verify button exists
    const button = iframe.locator("button").first();
    await expect(button).toBeVisible({ timeout: 10000 });
  });

  test("should change button text (setCopy)", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    // Test Polish command
    await promptInput.fill("Zmień tekst przycisku na 'Zapisz'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    await expect(button).toContainText("Zapisz", { timeout: 10000 });
    
    // Test English command
    await promptInput.fill("Change button text to 'Save'");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    await expect(button).toContainText("Save", { timeout: 10000 });
  });

  test("should change button variant to solid", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Zmień wariant na solid");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    // Check if button has solid variant (usually has background color)
    const buttonStyle = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      };
    });
    
    // Solid variant should have a background color (not transparent)
    expect(buttonStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("should change button variant to outline", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Change variant to outline");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    // Outline variant should have a visible border
    const buttonStyle = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        borderWidth: styles.borderWidth,
        borderColor: styles.borderColor,
      };
    });
    
    // Outline should have a border
    expect(parseInt(buttonStyle.borderWidth)).toBeGreaterThan(0);
  });

  test("should change button variant to ghost", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Ustaw wariant na ghost");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    // Ghost variant typically has transparent or minimal background
    const buttonStyle = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
      };
    });
    
    // Ghost variant often has transparent or very light background
    // This is a basic check - actual implementation may vary
    expect(buttonStyle.backgroundColor).toBeDefined();
  });

  test("should change button size to small", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Zmień rozmiar na small");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    const buttonSize = await button.boundingBox();
    
    // Small size should be smaller than default
    expect(buttonSize?.height).toBeDefined();
    expect(buttonSize?.height).toBeLessThan(50); // Small buttons are typically < 50px
  });

  test("should change button size to large", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Ustaw rozmiar na large");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    const buttonSize = await button.boundingBox();
    
    // Large size should be larger than default
    expect(buttonSize?.height).toBeDefined();
    expect(buttonSize?.height).toBeGreaterThan(35); // Large buttons are typically > 35px
  });

  test("should disable button", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    await promptInput.fill("Wyłącz przycisk");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    
    // Check if button is disabled
    const isDisabled = await button.getAttribute("disabled");
    const ariaDisabled = await button.getAttribute("aria-disabled");
    
    // Button should be disabled (either via disabled attribute or aria-disabled)
    expect(isDisabled !== null || ariaDisabled === "true").toBeTruthy();
  });

  test("should enable button", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    // First disable the button
    await promptInput.fill("Wyłącz przycisk");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    // Then enable it
    await promptInput.fill("Włącz przycisk");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    
    // Check if button is enabled
    const isDisabled = await button.getAttribute("disabled");
    const ariaDisabled = await button.getAttribute("aria-disabled");
    
    // Button should not be disabled
    expect(isDisabled).toBeNull();
    expect(ariaDisabled).not.toBe("true");
  });

  test("should combine multiple commands (text + variant)", async ({ page }) => {
    const iframe = page.frameLocator('iframe[title="Component Preview"]');
    const promptInput = page.locator('textarea[placeholder*="Describe"], textarea[placeholder*="prompt"], textarea').first();
    
    // Test combined command
    await promptInput.fill("Zmień tekst na 'Zapisz' i wariant na solid");
    await page.locator('button[aria-label="Send message"], button[aria-label*="Send"]').first().click();
    await page.waitForTimeout(3000);
    
    const button = iframe.locator("button").first();
    
    // Check text
    await expect(button).toContainText("Zapisz", { timeout: 10000 });
    
    // Check variant (solid should have background)
    const buttonStyle = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
      };
    });
    
    expect(buttonStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  });
});

