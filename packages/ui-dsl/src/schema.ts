/**
 * UI-DSL v2 Zod Schemas
 * 
 * Validation schemas for UI-DSL v2 types using Zod
 */

import { z } from "zod";

/**
 * Size schema
 */
export const SizeSchema = z.enum(["sm", "md", "lg", "xl"]);

/**
 * Id schema (UUID v4)
 */
export const IdSchema = z.string().uuid();

/**
 * A11y schema
 */
export const A11ySchema = z.object({
  ariaLabel: z.string().optional(),
  describedBy: z.string().optional(),
  ariaLabelledBy: z.string().optional(),
  role: z.string().optional(),
}).optional();

/**
 * Layout schema
 */
export const LayoutSchema = z.object({
  maxWidth: SizeSchema.optional(),
  gap: z.number().int().min(0).optional(),
  colSpan: z.number().int().min(1).optional(),
  padding: SizeSchema.optional(),
  margin: SizeSchema.optional(),
}).optional();

/**
 * UiCommon schema
 */
export const UiCommonSchema = z.object({
  id: IdSchema,
  name: z.string().optional(),
  a11y: A11ySchema,
  layout: LayoutSchema,
  testId: z.string().optional(),
  dataUiId: z.string().optional(),
});

/**
 * DataSource schemas
 */
export const DataSourcePlaceholderSchema = z.object({
  id: IdSchema,
  kind: z.literal("placeholder"),
  shape: z.enum(["table", "cards", "metrics", "list"]).optional(),
});

export const DataSourceStaticSchema = z.object({
  id: IdSchema,
  kind: z.literal("static"),
  data: z.any(),
});

export const DataSourceUrlSchema = z.object({
  id: IdSchema,
  kind: z.literal("url"),
  url: z.string().url(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional(),
  path: z.string().optional(),
  headers: z.record(z.string()).optional(),
});

export const DataSourceSchema = z.discriminatedUnion("kind", [
  DataSourcePlaceholderSchema,
  DataSourceStaticSchema,
  DataSourceUrlSchema,
]);

/**
 * Binding schema
 */
export const BindingSchema = z.object({
  sourceId: IdSchema,
  path: z.string(), // JSON path
  prop: z.string(), // Component prop name
});

/**
 * Metadata schema
 */
export const MetadataSchema = z.object({
  version: z.string().optional(),
  generatedAt: z.string().datetime().optional(),
  source: z.string().optional(),
}).optional();

/**
 * UiPage schema (with lazy reference to UiNodeSchema)
 */
export const UiPageSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("page"),
    id: IdSchema,
    name: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
    dataSources: z.array(DataSourceSchema).optional(),
    metadata: MetadataSchema,
  });
});

/**
 * Section data schemas for complex screens
 */
export const HeroSectionDataSchema = z.object({
  kind: z.literal("hero"),
  title: z.string(),
  description: z.string().optional(),
  cta: z.object({
    primary: z.object({
      label: z.string(),
      action: z.string().optional(),
    }).optional(),
    secondary: z.object({
      label: z.string(),
      action: z.string().optional(),
    }).optional(),
  }).optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  background: z.enum(["gradient", "image", "solid"]).optional(),
});

export const PricingSectionDataSchema = z.object({
  kind: z.literal("pricing"),
  title: z.string(),
  description: z.string().optional(),
  tiers: z.array(z.object({
    name: z.string(),
    price: z.string(),
    period: z.string().optional(),
    features: z.array(z.string()),
    cta: z.object({
      label: z.string(),
      action: z.string().optional(),
    }),
  })),
  layout: z.enum(["grid", "stack"]).optional(),
});

export const FeatureGridSectionDataSchema = z.object({
  kind: z.literal("featureGrid"),
  title: z.string(),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});

export const StatsSectionDataSchema = z.object({
  kind: z.literal("stats"),
  items: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    trend: z.enum(["up", "down", "neutral"]).optional(),
    change: z.string().optional(),
  })),
  layout: z.enum(["grid", "row"]).optional(),
});

export const TestimonialsSectionDataSchema = z.object({
  kind: z.literal("testimonials"),
  title: z.string(),
  items: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  })),
  layout: z.enum(["carousel", "grid"]).optional(),
});

export const FAQSectionDataSchema = z.object({
  kind: z.literal("faq"),
  title: z.string(),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
});

export const DataTableSectionDataSchema = z.object({
  kind: z.literal("dataTable"),
  title: z.string(),
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
    sortable: z.boolean().optional(),
  })),
  dataSourceId: IdSchema.optional(),
  pagination: z.boolean().optional(),
  filters: z.array(z.object({
    key: z.string(),
    type: z.enum(["text", "select", "date"]),
  })).optional(),
});

export const ChartSectionDataSchema = z.object({
  kind: z.literal("chart"),
  title: z.string(),
  chartType: z.enum(["line", "bar", "pie", "area"]),
  dataSourceId: IdSchema.optional(),
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
});

export const CTASectionDataSchema = z.object({
  kind: z.literal("cta"),
  title: z.string(),
  description: z.string().optional(),
  cta: z.object({
    label: z.string(),
    action: z.string().optional(),
  }),
  variant: z.enum(["primary", "secondary", "outline"]).optional(),
});

export const SectionDataSchema = z.discriminatedUnion("kind", [
  HeroSectionDataSchema,
  PricingSectionDataSchema,
  FeatureGridSectionDataSchema,
  StatsSectionDataSchema,
  TestimonialsSectionDataSchema,
  FAQSectionDataSchema,
  DataTableSectionDataSchema,
  ChartSectionDataSchema,
  CTASectionDataSchema,
]);

/**
 * UiSection schema (with lazy reference to UiNodeSchema)
 */
export const UiSectionSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("section"),
    id: IdSchema,
    name: z.string().optional(),
    title: z.string().optional(),
    variant: z.enum(["card", "panel", "hero", "plain", "banner"]).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
    kind: z.enum([
      "hero",
      "pricing",
      "featureGrid",
      "stats",
      "testimonials",
      "faq",
      "dataTable",
      "chart",
      "cta",
    ]).optional(),
    sectionData: SectionDataSchema.optional(),
  });
});

/**
 * UiGrid schema (with lazy reference to UiNodeSchema)
 */
export const UiGridSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("grid"),
    id: IdSchema,
    name: z.string().optional(),
    columns: z.number().int().min(1).max(12),
    responsive: z.object({
      sm: z.number().int().min(1).max(12).optional(),
      md: z.number().int().min(1).max(12).optional(),
      lg: z.number().int().min(1).max(12).optional(),
      xl: z.number().int().min(1).max(12).optional(),
    }).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
  });
});

/**
 * UiStack schema (with lazy reference to UiNodeSchema)
 */
export const UiStackSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("stack"),
    id: IdSchema,
    name: z.string().optional(),
    direction: z.enum(["vertical", "horizontal"]).optional(),
    gap: z.number().int().min(0).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
  });
});

/**
 * UiTwoColumn schema (with lazy reference to UiNodeSchema)
 */
export const UiTwoColumnSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("twoColumn"),
    id: IdSchema,
    name: z.string().optional(),
    ratio: z.enum(["1:1", "1:2", "2:1"]).optional(),
    gap: z.number().int().min(0).optional(),
    responsive: z.object({
      breakpoint: z.enum(["sm", "md", "lg"]).optional(),
      stack: z.boolean().optional(),
    }).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
  });
});

/**
 * UiThreeColumn schema (with lazy reference to UiNodeSchema)
 */
export const UiThreeColumnSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("threeColumn"),
    id: IdSchema,
    name: z.string().optional(),
    ratios: z.tuple([z.number(), z.number(), z.number()]).optional(),
    gap: z.number().int().min(0).optional(),
    responsive: z.object({
      breakpoint: z.enum(["sm", "md", "lg"]).optional(),
      stack: z.boolean().optional(),
    }).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
  });
});

/**
 * UiSidebar schema (with lazy reference to UiNodeSchema)
 */
export const UiSidebarSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("sidebar"),
    id: IdSchema,
    name: z.string().optional(),
    position: z.enum(["left", "right"]),
    sidebarWidth: z.enum(["sm", "md", "lg"]).optional(),
    contentMaxWidth: z.enum(["sm", "md", "lg", "xl", "full"]).optional(),
    gap: z.number().int().min(0).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
    children: z.array(UiNodeSchema),
  });
});

/**
 * UiBlockRef schema
 */
export const UiBlockRefSchema = z.object({
  type: z.literal("block"),
  id: IdSchema,
  name: z.string().optional(),
  ref: z.string(), // Block reference
  inputs: z.record(z.any()).optional(),
  a11y: A11ySchema,
  layout: LayoutSchema,
  testId: z.string().optional(),
  dataUiId: z.string().optional(),
});

/**
 * UiComponent schema (with lazy reference to UiNodeSchema)
 */
export const UiComponentSchema: z.ZodType<any> = z.lazy(() => {
  return z.object({
    type: z.literal("component"),
    id: IdSchema,
    name: z.string().optional(),
    component: z.string(), // Component name from registry
    props: z.record(z.any()).optional(),
    children: z.array(UiNodeSchema).optional(),
    slots: z.record(z.array(UiNodeSchema)).optional(),
    variant: z.string().optional(),
    copy: z.string().optional(),
    bind: z.array(BindingSchema).optional(),
    a11y: A11ySchema,
    layout: LayoutSchema,
    testId: z.string().optional(),
    dataUiId: z.string().optional(),
  });
});

/**
 * UiNode schema (union of all node types)
 * Defined after all node schemas to allow circular references
 * 
 * Note: Using z.union() instead of z.discriminatedUnion() to avoid issues
 * with circular references in discriminated unions.
 */
export const UiNodeSchema: z.ZodType<any> = z.lazy(() => {
  return z.union([
    UiPageSchema,
    UiSectionSchema,
    UiGridSchema,
    UiStackSchema,
    UiTwoColumnSchema,
    UiThreeColumnSchema,
    UiSidebarSchema,
    UiBlockRefSchema,
    UiComponentSchema,
  ]);
});

/**
 * Patch operation schema
 */
export const PatchOpSchema = z.enum([
  "setProp",
  "setCopy",
  "toggleVariant",
  "addNode",
  "removeNode",
  "moveNode",
  "wrapWith",
  "reorder",
  "rename",
  "setToken",
  "setBinding",
  "setDataSource",
]);

export const PatchSchema = z.object({
  targetId: IdSchema,
  op: PatchOpSchema,
  args: z.record(z.any()),
});

/**
 * Diagnostic schema
 */
export const DiagnosticSchema = z.object({
  level: z.enum(["error", "warning", "info"]),
  message: z.string(),
  path: z.string().optional(),
  code: z.string().optional(),
});

/**
 * Validation result schema
 */
export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  diagnostics: z.array(DiagnosticSchema),
});

