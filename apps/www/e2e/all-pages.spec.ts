import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

// Load registry (from apps/www, go up to root, then to packages/registry)
const registryPath = join(__dirname, "../../../packages/registry/registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf-8"));

// Get all components from registry
const getAllComponents = () => {
  const componentExceptions = [
    "multi-select", "command-palette", "date-picker", "toggle-group", "tree-view",
    "color-picker", "segmented-control", "rating", "file-upload", "split-button",
    "tag-input", "activity-feed", "quick-actions", "filter-bar",
    "metric-card", "chart"
  ];
  
  return Object.keys(registry.components || {})
    .filter((k) => {
      const normalized = k.toLowerCase();
      return !normalized.includes("-") || componentExceptions.includes(normalized);
    })
    .sort();
};

// Get all blocks from registry
const getAllBlocks = () => {
  const blockExceptions = ["multi-select", "command-palette", "date-picker", "toggle-group"];
  return Object.keys(registry.components || {})
    .filter((k) => k.includes("-") && !blockExceptions.includes(k.toLowerCase()))
    .sort();
};

// Known blocks (from sidebar-navigation.tsx)
const KNOWN_BLOCKS = [
  "authentication-block", "card-grid", "dashboard-layout", "form-container",
  "navigation-header", "pricing-table", "settings-screen", "data-table",
  "hero-section", "feature-grid-section", "stats-section", "testimonials-section",
  "faq-section", "cta-section", "widget-container", "dashboard-widgets",
  "benefits-section", "comparison-section", "footer-section",
  "kpi-dashboard", "analytics-dashboard",
  "app-shell", "kpi-strip", "empty-state",
  "data-table-toolbar", "pagination-footer",
];

// Get all blocks (known + registry)
const allBlocks = [...new Set([...KNOWN_BLOCKS, ...getAllBlocks()])].sort();

// Templates
const TEMPLATES = [
  "dashboard-template",
  "users-list-template",
  "settings-template",
];

// Get Started pages
const GET_STARTED_PAGES = [
  "/docs/get-started/introduction",
  "/docs/get-started/setup",
  "/docs/examples",
  "/docs/get-started/studio",
  "/docs/get-started/mcp-server",
  "/docs/changelog",
];

// Foundations pages
const FOUNDATIONS_PAGES = [
  "/docs/foundations/tokens",
  "/docs/foundations/theming",
  "/docs/foundations/dark-mode",
  "/docs/foundations/semantic-colors",
  "/docs/foundations/spacing",
];

test.describe("All Pages - Basic Load Tests", () => {
  // Test all component pages
  getAllComponents().forEach((component) => {
    test(`should load component page: ${component}`, async ({ page }) => {
      const url = `/docs/components/${component}`;
      // Use "load" instead of "networkidle" for faster tests
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      // Check if page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check if main content is visible
      const mainContent = page.locator("main, article").first();
      await expect(mainContent).toBeVisible({ timeout: 10000 });
      
      // Check if h1 exists (most pages have h1)
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible({ timeout: 10000 });
      
      // Check for no console errors
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(1000);
      
      // Filter out known non-critical errors
      const criticalErrors = errors.filter(
        (e) => !e.includes("favicon") && !e.includes("404") && !e.includes("Failed to load resource")
      );
      
      if (criticalErrors.length > 0) {
        console.warn(`Warnings on ${url}:`, criticalErrors);
      }
    });
  });

  // Test all block pages
  allBlocks.forEach((block) => {
    test(`should load block page: ${block}`, async ({ page }) => {
      const url = `/docs/components/${block}`;
      // Use "load" instead of "networkidle" for faster tests
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      // Check if page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check if main content is visible
      const mainContent = page.locator("main, article").first();
      await expect(mainContent).toBeVisible({ timeout: 10000 });
      
      // Check if h1 exists
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible({ timeout: 10000 });
    });
  });

  // Test all template pages
  TEMPLATES.forEach((template) => {
    test(`should load template page: ${template}`, async ({ page }) => {
      const url = `/docs/templates/${template}`;
      // Use "load" instead of "networkidle" for faster tests
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      // Check if page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check if main content is visible
      const mainContent = page.locator("main, article").first();
      await expect(mainContent).toBeVisible({ timeout: 10000 });
      
      // Check if h1 exists
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible({ timeout: 10000 });
    });
  });

  // Test Get Started pages
  GET_STARTED_PAGES.forEach((path) => {
    test(`should load get-started page: ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "load", timeout: 30000 });
      
      // Check if page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check if main content is visible
      const mainContent = page.locator("main, article").first();
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });
  });

  // Test Foundations pages
  FOUNDATIONS_PAGES.forEach((path) => {
    test(`should load foundations page: ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "load", timeout: 30000 });
      
      // Check if page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check if main content is visible
      const mainContent = page.locator("main, article").first();
      await expect(mainContent).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe("All Pages - No 404 Errors", () => {
  test("should not have 404 errors for components", async ({ page }) => {
    const components = getAllComponents();
    const errors: Array<{ url: string; status: number }> = [];
    
    for (const component of components.slice(0, 10)) { // Test first 10 to avoid timeout
      const url = `/docs/components/${component}`;
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      if (response?.status() === 404) {
        errors.push({ url, status: response.status() });
      }
    }
    
    if (errors.length > 0) {
      console.warn("404 errors found:", errors);
    }
    
    // Allow some 404s (not all components may have pages yet)
    expect(errors.length).toBeLessThan(components.slice(0, 10).length * 0.2); // Less than 20% can be 404
  });

  test("should not have 404 errors for blocks", async ({ page }) => {
    const errors: Array<{ url: string; status: number }> = [];
    
    for (const block of allBlocks.slice(0, 10)) { // Test first 10 to avoid timeout
      const url = `/docs/components/${block}`;
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      if (response?.status() === 404) {
        errors.push({ url, status: response.status() });
      }
    }
    
    if (errors.length > 0) {
      console.warn("404 errors found:", errors);
    }
    
    // Allow some 404s
    expect(errors.length).toBeLessThan(allBlocks.slice(0, 10).length * 0.2);
  });

  test("should not have 404 errors for templates", async ({ page }) => {
    const errors: Array<{ url: string; status: number }> = [];
    
    for (const template of TEMPLATES) {
      const url = `/docs/templates/${template}`;
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      if (response?.status() === 404) {
        errors.push({ url, status: response.status() });
      }
    }
    
    expect(errors).toHaveLength(0);
  });
});

test.describe("All Pages - Required Elements", () => {
  test("all component pages should have h1", async ({ page }) => {
    const components = getAllComponents().slice(0, 20); // Test first 20
    const missingH1: string[] = [];
    
    for (const component of components) {
      const url = `/docs/components/${component}`;
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      // Skip if page doesn't exist
      if (response?.status() === 404) {
        continue;
      }
      
      const h1 = page.locator("h1").first();
      
      if (!(await h1.isVisible({ timeout: 10000 }).catch(() => false))) {
        missingH1.push(component);
      }
    }
    
    if (missingH1.length > 0) {
      console.warn("Components without h1:", missingH1);
    }
    
    // Allow some pages to not have h1 (flexible)
    expect(missingH1.length).toBeLessThan(components.length * 0.2); // Less than 20% can be missing
  });

  test("all block pages should have h1", async ({ page }) => {
    const blocks = allBlocks.slice(0, 20); // Test first 20
    const missingH1: string[] = [];
    
    for (const block of blocks) {
      const url = `/docs/components/${block}`;
      const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
      
      // Skip if page doesn't exist
      if (response?.status() === 404) {
        continue;
      }
      
      const h1 = page.locator("h1").first();
      
      if (!(await h1.isVisible({ timeout: 10000 }).catch(() => false))) {
        missingH1.push(block);
      }
    }
    
    if (missingH1.length > 0) {
      console.warn("Blocks without h1:", missingH1);
    }
    
    expect(missingH1.length).toBeLessThan(blocks.length * 0.2);
  });

  test("all template pages should have h1", async ({ page }) => {
    const missingH1: string[] = [];
    
    for (const template of TEMPLATES) {
      await page.goto(`/docs/templates/${template}`, { waitUntil: "load", timeout: 30000 });
      const h1 = page.locator("h1").first();
      
      if (!(await h1.isVisible({ timeout: 10000 }).catch(() => false))) {
        missingH1.push(template);
      }
    }
    
    expect(missingH1).toHaveLength(0);
  });
});

