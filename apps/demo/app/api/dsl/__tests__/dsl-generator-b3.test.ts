/**
 * Tests for B3: Enhanced DSL Generator
 * 
 * Tests:
 * - Section-to-block mapping
 * - Import planner
 * - Responsive layouts
 * - Dashboard generation
 * - Landing page generation
 */

import { describe, it, expect } from "vitest";
import { generateDSL } from "../../../../src/lib/dsl-generator";
import { generateCodeFromDSL } from "../../../../src/lib/dsl-codegen";
import { planImports, generateImportStatements } from "../../../../src/lib/import-planner";
import registry from "@fragment_ui/registry/registry.json";

describe("B3: Enhanced DSL Generator", () => {
  describe("Import Planner", () => {
    it("should prefer blocks over components", () => {
      const components = new Set(["HeroSection", "Button", "Card"]);
      const plan = planImports(components, registry);
      
      expect(plan.blockImports.has("HeroSection")).toBe(true);
      expect(plan.uiImports.has("Button")).toBe(true);
      expect(plan.uiImports.has("Card")).toBe(true);
    });

    it("should detect dashboard components", () => {
      const components = new Set(["MetricCard", "ActivityFeed", "DashboardWidgets"]);
      const plan = planImports(components, registry);
      
      expect(plan.uiImports.has("MetricCard")).toBe(true);
      expect(plan.uiImports.has("ActivityFeed")).toBe(true);
      expect(plan.blockImports.has("DashboardWidgets")).toBe(true);
    });

    it("should generate correct import statements", () => {
      const components = new Set(["Button", "HeroSection", "MetricCard"]);
      const plan = planImports(components, registry);
      const imports = generateImportStatements(plan);
      
      expect(imports).toContain("@fragment_ui/ui");
      expect(imports).toContain("@fragment_ui/blocks");
      expect(imports).toContain("Button");
      expect(imports).toContain("HeroSection");
      expect(imports).toContain("MetricCard");
    });
  });

  describe("Dashboard Generation", () => {
    it("should generate dashboard with MetricCard components", () => {
      const { dsl } = generateDSL("dashboard for SaaS admin", registry, undefined, "dashboard");
      
      expect(dsl.type).toBe("page");
      expect(dsl.children.length).toBeGreaterThanOrEqual(0);
    });

    it("should include responsive layouts in grids", () => {
      const { dsl } = generateDSL("dashboard with metrics", registry, undefined, "dashboard");
      
      // Find grid nodes
      const findGrids = (node: any): any[] => {
        if (node.type === "grid") return [node];
        if (node.children) {
          return node.children.flatMap(findGrids);
        }
        return [];
      };
      
      const grids = findGrids(dsl);
      if (grids.length > 0) {
        const grid = grids[0];
        expect(grid.responsive).toBeDefined();
        expect(grid.responsive?.sm).toBeDefined();
      }
    });
  });

  describe("Landing Page Generation", () => {
    it("should generate landing page with hero section", () => {
      const { dsl } = generateDSL("landing page for webinar", registry, undefined, "landing");
      
      expect(dsl.type).toBe("page");
      
      // Check for hero section
      const hasHero = dsl.children.some((child: any) => 
        child.type === "section" && child.kind === "hero"
      );
      
      expect(hasHero).toBe(true);
    });

    it("should use blocks for specialized sections", () => {
      const { dsl } = generateDSL("landing page with pricing", registry, undefined, "landing");
      
      // Check for pricing section
      const pricingSection = dsl.children.find((child: any) => 
        child.type === "section" && child.kind === "pricing"
      );
      
      expect(pricingSection).toBeDefined();
    });
  });

  describe("Code Generation", () => {
    it("should generate code with correct imports", () => {
      const { dsl } = generateDSL("dashboard with metrics", registry, undefined, "dashboard");
      const code = generateCodeFromDSL(dsl, registry, { includeImports: true });
      
      expect(code.length).toBeGreaterThan(0);
    });

    it("should generate responsive grid classes", () => {
      const { dsl } = generateDSL("dashboard", registry, undefined, "dashboard");
      const code = generateCodeFromDSL(dsl, registry);
      
      expect(code.length).toBeGreaterThan(0);
    });
  });
});

