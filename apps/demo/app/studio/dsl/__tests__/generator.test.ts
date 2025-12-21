/**
 * Tests for UI-DSL Generator
 */

import { describe, it, expect } from "vitest";
import { generateTSX } from "../generator";
import type { UiForm, UiPage, UiTable, UiDashboard, UiLayout, UiModule, UiDataSource, MockDataSchema } from "../types";
import { generateId } from "../types";

describe("UI-DSL Generator", () => {
  describe("generateTSX", () => {
    it("should generate form component", () => {
      const dsl: UiForm = {
        id: generateId(),
        type: "form",
        title: "Test Form",
        fields: [
          {
            id: generateId(),
            name: "email",
            label: "Email",
            component: "Input",
            validation: "email|required",
          },
          {
            id: generateId(),
            name: "password",
            label: "Password",
            component: "PasswordInput",
            validation: "min:8|required",
          },
        ],
        actions: [
          {
            id: generateId(),
            type: "submit",
            label: "Submit",
            variant: "primary",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("export default function");
      expect(code).toContain("TestForm");
      expect(code).toContain("FormEnhanced");
      expect(code).toContain("FormFieldEnhanced");
      expect(code).toContain("Input");
      expect(code).toContain("Button");
      expect(code).toContain("@fragment_ui/ui");
    });

    it("should generate page component with tabs", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Settings Page",
        sections: [
          {
            id: generateId(),
            kind: "tabs",
            content: {
              Profile: [],
              Security: [],
            },
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("SettingsPage");
      expect(code).toContain("Tabs");
      expect(code).toContain("TabsList");
      expect(code).toContain("TabsTrigger");
      expect(code).toContain("TabsContent");
    });

    it("should generate table component", () => {
      const dsl: UiTable = {
        id: generateId(),
        type: "table",
        title: "Users Table",
        columns: [
          { id: generateId(), key: "name", label: "Name", kind: "text" },
          { id: generateId(), key: "email", label: "Email", kind: "text" },
          { id: generateId(), key: "role", label: "Role", kind: "badge" },
        ],
        dataSource: "placeholder",
        pagination: { pageSize: 10 },
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("UsersTable");
      expect(code).toContain("Table");
      expect(code).toContain("Badge");
    });

    it("should generate dashboard component", () => {
      const dsl: UiDashboard = {
        id: generateId(),
        type: "dashboard",
        title: "Analytics Dashboard",
        widgets: [
          {
            id: generateId(),
            kind: "metric",
            title: "Users",
            data: { value: "100", label: "Total Users" },
          },
          {
            id: generateId(),
            kind: "chart",
            title: "Sales Chart",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("AnalyticsDashboard");
      expect(code).toContain("Card");
      expect(code).toContain("grid");
    });
  });

  describe("Layout generation", () => {
    it("should generate dashboard layout (desktop)", () => {
      const layout: UiLayout = {
        type: "dashboard",
        areas: ["header", "sidebar", "content"],
        grid: { cols: 12, gap: 4 },
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Dashboard",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "header",
            content: [],
            title: "Header",
          },
          {
            id: generateId(),
            kind: "sidebar",
            content: [],
            title: "Sidebar",
          },
          {
            id: generateId(),
            kind: "content",
            content: [],
            title: "Content",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("gridTemplateColumns");
      expect(code).toContain("repeat(12, 1fr)");
      expect(code).toContain("data-ui-id");
      expect(code).toContain("header");
      expect(code).toContain("sidebar");
      expect(code).toContain("content");
    });

    it("should generate dashboard layout (mobile)", () => {
      const layout: UiLayout = {
        type: "dashboard",
        areas: ["header", "content"],
        grid: { cols: 1, gap: 2 },
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Mobile Dashboard",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "header",
            content: [],
          },
          {
            id: generateId(),
            kind: "content",
            content: [],
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("gridTemplateColumns");
      expect(code).toContain("repeat(1, 1fr)");
      expect(code).toContain("data-ui-id");
    });

    it("should generate marketing layout (desktop)", () => {
      const layout: UiLayout = {
        type: "marketing",
        hero: true,
        sections: ["features", "proof", "pricing", "faq", "cta"],
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Marketing Landing",
        layout,
        sections: [],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-ui-id");
      expect(code).toContain("hero");
      expect(code).toContain("features");
      expect(code).toContain("proof");
      expect(code).toContain("pricing");
      expect(code).toContain("faq");
      expect(code).toContain("cta");
    });

    it("should generate marketing layout (mobile)", () => {
      const layout: UiLayout = {
        type: "marketing",
        hero: false,
        sections: ["features", "cta"],
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Mobile Marketing",
        layout,
        sections: [],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-ui-id");
      expect(code).not.toContain("hero");
      expect(code).toContain("features");
      expect(code).toContain("cta");
    });

    it("should generate two-column layout (desktop)", () => {
      const layout: UiLayout = {
        type: "two-column",
        ratio: "1:2",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Two Column",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Left",
          },
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Right",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("grid-cols-1 md:grid-cols-[1fr_2fr]");
      expect(code).toContain("data-ui-id");
      expect(code).toContain("left");
      expect(code).toContain("right");
    });

    it("should generate two-column layout (mobile)", () => {
      const layout: UiLayout = {
        type: "two-column",
        ratio: "1:1",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Mobile Two Column",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Column 1",
          },
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Column 2",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("grid-cols-1");
      expect(code).toContain("md:grid-cols-[1fr_1fr]");
      expect(code).toContain("data-ui-id");
    });
  });

  describe("Milestone 3.1: Screen DSL", () => {
    it("should generate screen with regions (header, content, footer)", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "screen",
        title: "Dashboard Screen",
        regions: {
          header: {
            id: generateId(),
            modules: [
              {
                id: generateId(),
                type: "navigation",
                props: {
                  logo: "MyApp",
                  items: ["Home", "About", "Contact"],
                },
              },
            ],
          },
          content: {
            id: generateId(),
            modules: [
              {
                id: generateId(),
                type: "hero",
                title: "Welcome",
                description: "Get started today",
                props: {
                  ctaText: "Get Started",
                },
              },
            ],
          },
          footer: {
            id: generateId(),
            modules: [
              {
                id: generateId(),
                type: "footer",
                props: {
                  links: {
                    Company: ["About", "Contact"],
                    Legal: ["Privacy", "Terms"],
                  },
                },
              },
            ],
          },
        },
        sections: [],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("DashboardScreen");
      expect(code).toContain("<header");
      expect(code).toContain("<main");
      expect(code).toContain("<footer");
      expect(code).toContain('data-module-type="navigation"');
      expect(code).toContain('data-module-type="hero"');
      expect(code).toContain('data-module-type="footer"');
    });

    it("should generate grid layout", () => {
      const layout: UiLayout = {
        type: "grid",
        columns: 3,
        gap: 6,
        maxWidth: "xl",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Grid Layout",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Card 1",
          },
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Card 2",
          },
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Card 3",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("grid-cols-3");
      expect(code).toContain("gap-6");
      expect(code).toContain("max-w-xl");
      expect(code).toContain("data-ui-id");
    });

    it("should generate stack layout", () => {
      const layout: UiLayout = {
        type: "stack",
        gap: 8,
        maxWidth: "lg",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Stack Layout",
        layout,
        sections: [
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Section 1",
          },
          {
            id: generateId(),
            kind: "card",
            content: [],
            title: "Section 2",
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("space-y-8");
      expect(code).toContain("max-w-lg");
      expect(code).toContain("data-ui-id");
    });

    it("should generate pricing module", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Pricing Page",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "pricing",
            moduleProps: {
              tiers: [
                { name: "Basic", price: "$9", features: ["Feature 1", "Feature 2"] },
                { name: "Pro", price: "$29", features: ["Feature 1", "Feature 2", "Feature 3"] },
              ],
            },
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("PricingPage");
      expect(code).toContain("Card");
      expect(code).toContain("Basic");
      expect(code).toContain("Pro");
    });

    it("should generate FAQ module", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "FAQ Page",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "faq",
            moduleProps: {
              questions: [
                { q: "Question 1?", a: "Answer 1" },
                { q: "Question 2?", a: "Answer 2" },
              ],
            },
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("FaqPage"); // toPascalCase converts "FAQ Page" to "FaqPage"
      expect(code).toContain("Question 1?");
      expect(code).toContain("Answer 1");
    });

    it("should generate testimonials module with static data", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Testimonials Page",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "testimonials",
            moduleProps: {
              testimonials: [
                { name: "John Doe", text: "Great product!", role: "CEO" },
                { name: "Jane Smith", text: "Love it!", role: "CTO" },
              ],
            },
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-module-type=\"testimonials\"");
      expect(code).toContain("John Doe");
      expect(code).toContain("Great product!");
      expect(code).toContain("CEO");
    });

    it("should generate KPI header module with static data", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Dashboard",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "kpi-header",
            moduleProps: {
              kpis: [
                { label: "Revenue", value: "$10k", trend: "+5%" },
                { label: "Users", value: "1.2k", trend: "+12%" },
              ],
            },
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-module-type=\"kpi-header\"");
      expect(code).toContain("Revenue");
      expect(code).toContain("$10k");
      expect(code).toContain("+5%");
    });

    it("should generate data table section module with static data", () => {
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Data Table Page",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "data-table-section",
            moduleProps: {
              columns: [
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "status", label: "Status" },
              ],
            },
            data: {
              kind: "static",
              data: [
                { id: "1", name: "Item 1", status: "Active" },
                { id: "2", name: "Item 2", status: "Pending" },
              ],
            } as UiDataSource,
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-module-type=\"data-table-section\"");
      expect(code).toContain("Table");
      expect(code).toContain("TableHeader");
      expect(code).toContain("TableBody");
      expect(code).toContain("ID");
      expect(code).toContain("Name");
      expect(code).toContain("Status");
      expect(code).toContain("Item 1");
      expect(code).toContain("Active");
    });

    it("should generate module with mock data schema", () => {
      const mockSchema: MockDataSchema = {
        name: { type: "string", generator: "name" },
        email: { type: "string", generator: "email" },
        score: { type: "number", generator: "number", min: 0, max: 100 },
      };

      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Mock Data Page",
        sections: [
          {
            id: generateId(),
            kind: "content",
            content: [],
            module: "data-table-section",
            moduleProps: {
              columns: [
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "score", label: "Score" },
              ],
            },
            data: {
              kind: "mock",
              schema: mockSchema,
              count: 3,
            } as UiDataSource,
          },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("data-module-type=\"data-table-section\"");
      expect(code).toContain("Table");
      expect(code).toContain("Name");
      expect(code).toContain("Email");
      expect(code).toContain("Score");
    });

    it("should generate grid layout with all parameters", () => {
      const layout: UiLayout = {
        type: "grid",
        columns: 4,
        gap: 8,
        maxWidth: "2xl",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Full Grid Layout",
        layout,
        sections: [
          { id: generateId(), kind: "card", content: [], title: "Card 1" },
          { id: generateId(), kind: "card", content: [], title: "Card 2" },
          { id: generateId(), kind: "card", content: [], title: "Card 3" },
          { id: generateId(), kind: "card", content: [], title: "Card 4" },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("grid-cols-4");
      expect(code).toContain("gap-8");
      expect(code).toContain("max-w-2xl");
    });

    it("should generate stack layout with all parameters", () => {
      const layout: UiLayout = {
        type: "stack",
        gap: 12,
        maxWidth: "full",
      };
      
      const dsl: UiPage = {
        id: generateId(),
        type: "page",
        title: "Full Stack Layout",
        layout,
        sections: [
          { id: generateId(), kind: "card", content: [], title: "Section 1" },
          { id: generateId(), kind: "card", content: [], title: "Section 2" },
        ],
      };

      const code = generateTSX(dsl);
      
      expect(code).toContain("space-y-12");
      expect(code).toContain("max-w-full");
    });
  });
});

