/**
 * Unit tests for Code Generation API
 */

import { describe, it, expect } from "vitest";
import { generateCodeFromDSL } from "@/lib/dsl-codegen";
import type { UiPage, UiComponent, UiSection } from "@fragment_ui/ui-dsl";

describe("dsl-codegen", () => {
  const createTestPage = (): UiPage => ({
    type: "page",
    id: "page-1",
    title: "Test Page",
    description: "Test",
    children: [
      {
        type: "component",
        id: "button-1",
        component: "Button",
        props: { variant: "solid", size: "md" },
        copy: "Click me",
      } as UiComponent,
    ],
    dataSources: [],
  });

  const mockRegistry = {
    components: {
      Button: {
        props: {
          variant: "string",
          size: "string",
        },
        variants: ["solid", "outline", "ghost"],
      },
      Card: {
        props: {},
        slots: ["header", "content", "footer"],
      },
    },
  };

  describe("generateCodeFromDSL", () => {
    it("should generate TSX code with imports", () => {
      const dsl = createTestPage();
      const code = generateCodeFromDSL(dsl, mockRegistry, {
        includeImports: true,
        componentName: "TestPage",
      });

      expect(code).toContain('import { Button } from "@fragment_ui/ui"');
      expect(code).toContain('import * as React from "react"');
      expect(code).toContain("export function TestPage()");
    });

    it("should include data-ui-id on all elements", () => {
      const dsl = createTestPage();
      const code = generateCodeFromDSL(dsl, mockRegistry);

      expect(code).toContain('data-ui-id="page-1"');
      expect(code).toContain('data-ui-id="button-1"');
    });

    it("should generate component with props", () => {
      const dsl = createTestPage();
      const code = generateCodeFromDSL(dsl, mockRegistry);

      expect(code).toContain('variant="solid"');
      expect(code).toContain('size="md"');
      expect(code).toContain('children="Click me"');
    });

    it("should generate section with Card variant", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [
          {
            type: "section",
            id: "section-1",
            title: "My Section",
            variant: "card",
            children: [],
          } as UiSection,
        ],
        dataSources: [],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain("<Card");
      expect(code).toContain("<CardHeader>");
      expect(code).toContain("<CardTitle>My Section</CardTitle>");
      expect(code).toContain("<CardContent>");
      expect(code).toContain('data-ui-id="section-1"');
    });

    it("should generate grid with columns", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [
          {
            type: "grid",
            id: "grid-1",
            columns: 3,
            children: [
              {
                type: "component",
                id: "card-1",
                component: "Card",
                props: {},
              } as UiComponent,
            ],
          },
        ],
        dataSources: [],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      // Grid generates responsive classes by default
      expect(code).toContain('grid');
      expect(code).toContain('lg:grid-cols-3');
      expect(code).toContain('data-ui-id="grid-1"');
    });

    it("should generate datasource hooks for placeholder", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [],
        dataSources: [
          {
            id: "ds-1",
            kind: "placeholder",
            shape: "table",
          },
        ],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain("generatePlaceholderData");
      expect(code).toContain('const [data0, setData0]');
      expect(code).toContain('generatePlaceholderData("table")');
    });

    it("should generate datasource hooks for URL", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [],
        dataSources: [
          {
            id: "ds-1",
            kind: "url",
            url: "https://api.example.com/data",
          },
        ],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain('const [data0, setData0] = React.useState(null)');
      expect(code).toContain("React.useEffect");
      expect(code).toContain('fetch("https://api.example.com/data")');
    });

    it("should generate bindings from datasource to component", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [
          {
            type: "component",
            id: "table-1",
            component: "DataTable",
            props: {},
            bind: [
              {
                sourceId: "ds-1",
                path: "rows",
                prop: "data",
              },
            ],
          } as UiComponent,
        ],
        dataSources: [
          {
            id: "ds-1",
            kind: "placeholder",
            shape: "table",
          },
        ],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain('data={data0}');
    });

    it("should generate slots for Card component", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [
          {
            type: "component",
            id: "card-1",
            component: "Card",
            props: {},
            slots: {
              header: [
                {
                  type: "component",
                  id: "title-1",
                  component: "CardTitle",
                  props: {},
                  copy: "Card Title",
                } as UiComponent,
              ],
              content: [
                {
                  type: "component",
                  id: "text-1",
                  component: "Text",
                  props: {},
                  copy: "Card content",
                } as UiComponent,
              ],
            },
          } as UiComponent,
        ],
        dataSources: [],
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain("<CardHeader>");
      expect(code).toContain("<CardContent>");
    });

    it("should generate Storybook story when requested", () => {
      const dsl = createTestPage();
      const code = generateCodeFromDSL(dsl, mockRegistry, {
        generateStorybook: true,
        componentName: "TestPage",
      });

      expect(code).toContain("@storybook/react");
      expect(code).toContain("Meta");
      expect(code).toContain("StoryObj");
      expect(code).toContain("Generated/TestPage");
    });

    it("should generate layout classes", () => {
      const dsl: UiPage = {
        type: "page",
        id: "page-1",
        title: "Test",
        description: "Test",
        children: [],
        dataSources: [],
        layout: {
          maxWidth: "lg",
          gap: 4,
          padding: "md",
        },
      };

      const code = generateCodeFromDSL(dsl, mockRegistry);
      expect(code).toContain('max-w-lg');
      expect(code).toContain('gap-4');
      expect(code).toContain('p-md');
    });
  });
});

