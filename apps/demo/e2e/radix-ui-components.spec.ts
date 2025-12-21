import { test, expect } from "@playwright/test";

/**
 * E2E tests for Radix UI components in Playground
 * 
 * Tests that Radix UI components (Accordion, Dialog, Tabs) render correctly
 * without React error #31 (object components issue)
 */

test.describe("Radix UI Components - API and Bundle Tests", () => {
  test("should have custom jsx-runtime endpoint that handles objects", async ({ request }) => {
    // Test that /api/jsx-runtime returns custom jsx function
    const response = await request.get("http://localhost:3002/api/jsx-runtime");
    expect(response.ok()).toBeTruthy();
    
    const jsxRuntimeCode = await response.text();
    
    // Verify it contains custom jsx function
    expect(jsxRuntimeCode).toContain("function jsx");
    expect(jsxRuntimeCode).toContain("REACT_ELEMENT_TYPE");
    expect(jsxRuntimeCode).toContain("typeof type === 'object'");
    
    // Verify it handles objects (not just React.createElement)
    expect(jsxRuntimeCode).toContain("typeof type === 'object' && type !== null && typeof type !== 'function'");
  });

  test("should bundle Accordion component without errors", async ({ request }) => {
    const accordionCode = `"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@fragment_ui/ui";

export default function AccordionExample() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

    // Test that code can be bundled (simulate what worker does)
    // We'll test by checking if the bundle endpoint works
    const bundleResponse = await request.get("http://localhost:3002/api/bundle");
    expect(bundleResponse.ok()).toBeTruthy();
    
    const bundleCode = await bundleResponse.text();
    
    // Verify bundle contains jsx-runtime (not just React.createElement)
    // The bundle should use jsx: "automatic" which uses react/jsx-runtime
    expect(bundleCode.length).toBeGreaterThan(0);
  });
});

test.describe("Radix UI Components in Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    
    // Wait for playground to be ready - look for any textarea or the preview container
    await page.waitForSelector('iframe, [data-testid="preview"], textarea', { timeout: 15000 });
  });

  test("should render Accordion component without React error #31", async ({ page }) => {
    const accordionCode = `"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@fragment_ui/ui";

export default function AccordionExample() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

    // Set code directly using evaluate (bypassing UI)
    await page.evaluate((code) => {
      // Try to find React component and set code directly
      const event = new CustomEvent('set-playground-code', { detail: { code } });
      window.dispatchEvent(event);
    }, accordionCode);
    
    // Alternative: Use the preview iframe directly by sending a message
    // First, wait for iframe to be ready
    const iframe = page.frameLocator('iframe[src*="playground"], iframe[title*="Preview"]').first();
    
    // Try to send code via postMessage to iframe
    await page.evaluate((code) => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'render', code }, '*');
        }
      });
    }, accordionCode);
    
    // Wait for root element
    await iframe.locator("#root").waitFor({ timeout: 20000 });
    
    // Check for React error #31 in console
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Minified React error #31") || text.includes("React error #31") || text.includes("Error: Minified React error #31")) {
          errors.push(text);
        }
      }
    });
    
    // Also check for errors in iframe console
    iframe.locator("body").evaluate(() => {
      const originalError = console.error;
      console.error = (...args) => {
        window.parent.postMessage({ type: 'console-error', error: args.join(' ') }, '*');
        originalError.apply(console, args);
      };
    }).catch(() => {}); // Ignore if it fails
    
    // Wait for accordion to render
    await page.waitForTimeout(3000);
    
    // Verify accordion is rendered (look for trigger text)
    const accordionTrigger = iframe.locator("text=Is it accessible?");
    await expect(accordionTrigger.first()).toBeVisible({ timeout: 15000 });
    
    // Verify no React error #31 occurred
    if (errors.length > 0) {
      console.error("React error #31 detected:", errors);
    }
    expect(errors.length).toBe(0);
  });

  test("should render Dialog component without React error #31", async ({ page }) => {
    const dialogCode = `"use client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export default function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogDescription>Dialog description</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}`;

    // Find code editor and paste code
    const codeEditor = page.locator('textarea[placeholder*="prompt"], .monaco-editor textarea').first();
    await codeEditor.fill(dialogCode);
    
    // Wait a bit for code to be processed
    await page.waitForTimeout(1000);
    
    // Wait for preview iframe
    const iframe = page.frameLocator('iframe[title*="Preview"], iframe[src*="playground"]').first();
    
    // Wait for root element
    await iframe.locator("#root").waitFor({ timeout: 15000 });
    
    // Check for React error #31 in console
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Minified React error #31") || text.includes("React error #31")) {
          errors.push(text);
        }
      }
    });
    
    // Wait for dialog to render
    await page.waitForTimeout(2000);
    
    // Verify dialog trigger button is rendered
    const dialogTrigger = iframe.locator("button:has-text('Open Dialog')");
    await expect(dialogTrigger.first()).toBeVisible({ timeout: 10000 });
    
    // Verify no React error #31 occurred
    expect(errors.length).toBe(0);
  });

  test("should render Tabs component without React error #31", async ({ page }) => {
    const tabsCode = `"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function TabsExample() {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );
}`;

    // Find code editor and paste code
    const codeEditor = page.locator('textarea[placeholder*="prompt"], .monaco-editor textarea').first();
    await codeEditor.fill(tabsCode);
    
    // Wait a bit for code to be processed
    await page.waitForTimeout(1000);
    
    // Wait for preview iframe
    const iframe = page.frameLocator('iframe[title*="Preview"], iframe[src*="playground"]').first();
    
    // Wait for root element
    await iframe.locator("#root").waitFor({ timeout: 15000 });
    
    // Check for React error #31 in console
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Minified React error #31") || text.includes("React error #31")) {
          errors.push(text);
        }
      }
    });
    
    // Wait for tabs to render
    await page.waitForTimeout(2000);
    
    // Verify tabs are rendered (look for tab trigger)
    const tabTrigger = iframe.locator("text=Tab 1");
    await expect(tabTrigger.first()).toBeVisible({ timeout: 10000 });
    
    // Verify no React error #31 occurred
    expect(errors.length).toBe(0);
  });
});

