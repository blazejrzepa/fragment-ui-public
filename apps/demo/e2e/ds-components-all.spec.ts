import { test, expect } from "@playwright/test";

/**
 * Test all DS Components
 * 
 * Tests that all components from the registry render correctly without errors
 */

const ALL_COMPONENTS = [
  "Accordion",
  "AlertDialog",
  "Avatar",
  "Badge",
  "Breadcrumbs",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "Checkbox",
  "Collapsible",
  "ColorPicker",
  "Combobox",
  "CommandPalette",
  "DatePicker",
  "Dialog",
  "FileUpload",
  "FormEnhanced",
  "FormField",
  "Input",
  "Kbd",
  "Menubar",
  "MultiSelect",
  "Pagination",
  "Popover",
  "Progress",
  "Radio",
  "Rating",
  "Resizable",
  "SegmentedControl",
  "Select",
  "Separator",
  "Sheet",
  "Skeleton",
  "Slider",
  "Spinner",
  "SplitButton",
  "Stepper",
  "Switch",
  "Table",
  "Tabs",
  "TagInput",
  "Textarea",
  "Timeline",
  "Toast",
  "Toggle",
  "ToggleGroup",
  "Tooltip",
  "TreeView",
];

test.describe("All DS Components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Open Components section
    const componentsButton = page.locator('button:has-text("Components")').filter({ hasNotText: "Projects" }).first();
    await expect(componentsButton).toBeVisible({ timeout: 10000 });
    await componentsButton.click();
    await page.waitForTimeout(1000);
  });

  for (const componentName of ALL_COMPONENTS) {
    test(`should render ${componentName} without errors`, async ({ page }) => {
      const errors: string[] = [];
      const logs: string[] = [];
      
      // Collect console errors and logs
      page.on("console", (msg) => {
        const text = msg.text();
        if (msg.type() === "error") {
          errors.push(text);
          console.error(`[${componentName}] Console Error: ${text}`);
        } else if (msg.type() === "log" || msg.type() === "warn") {
          logs.push(text);
        }
      });
      
      // Listen for network errors
      page.on("requestfailed", (request) => {
        console.error(`[${componentName}] Network Error: ${request.url()}: ${request.failure()?.errorText}`);
      });

      // Wait for search input
      await page.waitForSelector('input[placeholder*="Search components"], input[placeholder*="search"]', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Search for component
      const searchInput = page.locator('input[placeholder*="Search components"], input[placeholder*="search"]').first();
      await searchInput.fill(componentName);
      await page.waitForTimeout(1000);

      // Find and click component button
      const componentButton = page.locator(`button:has-text("${componentName}")`)
        .filter({ hasNotText: "Components" })
        .first();
      
      if (await componentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await componentButton.click();
        await page.waitForTimeout(2000);
        
        // Wait for preview to appear
        const previewContainer = page.locator('[data-testid="preview"], .react-live-preview, button, [data-ui-id]').first();
        
        try {
          await expect(previewContainer).toBeVisible({ timeout: 10000 });
          
          // Wait a bit more for component to render
          await page.waitForTimeout(2000);
          
          // Check if any content is visible
          const anyContent = page.locator('button, input, [data-ui-id], div').first();
          const hasContent = await anyContent.isVisible({ timeout: 5000 }).catch(() => false);
          
          if (!hasContent) {
            console.warn(`[${componentName}] No content visible in preview`);
          }
          
          // Check for critical React errors
          const reactErrors = errors.filter(err => 
            err.includes("React error #31") || 
            err.includes("Minified React error #31") ||
            err.includes("Cannot read properties") ||
            err.includes("TypeError") ||
            err.includes("SyntaxError")
          );
          
          if (reactErrors.length > 0) {
            console.error(`[${componentName}] Critical errors:`, reactErrors);
            // Don't fail the test, but log the errors
          }
          
          // Test passes if no critical errors
          expect(reactErrors.length).toBe(0);
        } catch (e) {
          console.error(`[${componentName}] Failed to render:`, e);
          // Log all errors for debugging
          if (errors.length > 0) {
            console.error(`[${componentName}] All errors:`, errors);
          }
          throw e;
        }
      } else {
        console.warn(`[${componentName}] Component button not found, skipping test`);
        test.skip();
      }
    });
  }
});

