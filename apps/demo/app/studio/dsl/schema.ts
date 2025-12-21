/**
 * UI-DSL JSON Schema
 * 
 * JSON Schema for validating UI-DSL structure.
 * Used for runtime validation of DSL objects.
 */

import type { UiDsl } from './types';

export const uiDslSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  oneOf: [
    {
      type: "object",
      properties: {
        type: { const: "form" },
        title: { type: "string" },
        layout: {
          type: "object",
          properties: {
            maxWidth: { enum: ["sm", "md", "lg", "xl"] },
            gap: { type: "number" },
          },
        },
        a11y: {
          type: "object",
          properties: {
            ariaDescribedBy: { type: "string" },
            ariaLabel: { type: "string" },
          },
        },
        fields: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "label", "component"],
            properties: {
              name: { type: "string" },
              label: { type: "string" },
              component: {
                enum: ["Input", "PasswordInput", "Checkbox", "Select", "Switch", "Textarea"],
              },
              options: { type: "array", items: { type: "string" } },
              validation: { type: "string" },
              placeholder: { type: "string" },
              description: { type: "string" },
              required: { type: "boolean" },
            },
          },
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            required: ["type", "label"],
            properties: {
              type: { enum: ["submit", "reset", "button"] },
              label: { type: "string" },
              variant: { enum: ["primary", "secondary", "ghost"] },
              onClick: { type: "string" },
            },
          },
        },
        onSubmit: { type: "string" },
      },
      required: ["type", "fields"],
    },
    {
      type: "object",
      properties: {
        type: { const: "page" },
        title: { type: "string" },
        layout: {
          oneOf: [
            {
          type: "object",
          properties: {
            maxWidth: { enum: ["sm", "md", "lg", "xl"] },
            gap: { type: "number" },
          },
            },
            {
              type: "object",
              properties: {
                type: { const: "dashboard" },
                areas: {
                  type: "array",
                  items: { enum: ["header", "sidebar", "content"] },
                },
                grid: {
                  type: "object",
                  properties: {
                    cols: { type: "number" },
                    gap: { type: "number" },
                  },
                },
              },
              required: ["type", "areas"],
            },
            {
              type: "object",
              properties: {
                type: { const: "marketing" },
                hero: { type: "boolean" },
                sections: {
                  type: "array",
                  items: { enum: ["features", "proof", "pricing", "faq", "cta"] },
                },
              },
              required: ["type", "sections"],
            },
            {
              type: "object",
              properties: {
                type: { const: "two-column" },
                ratio: { enum: ["1:1", "1:2", "2:1"] },
              },
              required: ["type"],
            },
          ],
        },
        a11y: {
          type: "object",
          properties: {
            ariaDescribedBy: { type: "string" },
            ariaLabel: { type: "string" },
          },
        },
        sections: {
          type: "array",
          items: {
            type: "object",
            required: ["kind", "content"],
            properties: {
              kind: { type: "string" },
              content: {
                oneOf: [
                  { type: "array" },
                  { type: "object" },
                ],
              },
              title: { type: "string" },
              data: {
                oneOf: [
                  { type: "object", properties: { kind: { const: "placeholder" } }, required: ["kind"] },
                  { type: "object", properties: { kind: { const: "static" }, data: {} }, required: ["kind", "data"] },
                  {
                    type: "object",
                    properties: {
                      kind: { const: "http" },
                      url: { type: "string" },
                      method: { enum: ["GET", "POST"] },
                      params: { type: "object" },
                    },
                    required: ["kind", "url"],
                  },
                ],
              },
            },
          },
        },
      },
      required: ["type", "sections"],
    },
    {
      type: "object",
      properties: {
        type: { const: "table" },
        title: { type: "string" },
        layout: {
          type: "object",
          properties: {
            maxWidth: { enum: ["sm", "md", "lg", "xl"] },
            gap: { type: "number" },
          },
        },
        a11y: {
          type: "object",
          properties: {
            ariaDescribedBy: { type: "string" },
            ariaLabel: { type: "string" },
          },
        },
        columns: {
          type: "array",
          items: {
            type: "object",
            required: ["key", "label"],
            properties: {
              key: { type: "string" },
              label: { type: "string" },
              kind: { enum: ["text", "badge", "date", "actions"] },
              width: { type: "string" },
            },
          },
        },
        dataSource: { enum: ["placeholder", "url", "static"] },
        data: { type: "array" },
        filters: {
          type: "array",
          items: {
            type: "object",
            required: ["type", "key"],
            properties: {
              type: { enum: ["search", "select", "dateRange"] },
              key: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              placeholder: { type: "string" },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            pageSize: { type: "number" },
            showSizeChanger: { type: "boolean" },
          },
        },
      },
      required: ["type", "columns", "dataSource"],
    },
    {
      type: "object",
      properties: {
        type: { const: "dashboard" },
        title: { type: "string" },
        layout: {
          type: "object",
          properties: {
            maxWidth: { enum: ["sm", "md", "lg", "xl"] },
            gap: { type: "number" },
          },
        },
        a11y: {
          type: "object",
          properties: {
            ariaDescribedBy: { type: "string" },
            ariaLabel: { type: "string" },
          },
        },
        widgets: {
          type: "array",
          items: {
            type: "object",
            required: ["kind"],
            properties: {
              kind: { enum: ["metric", "chart", "table"] },
              title: { type: "string" },
              data: {},
            },
          },
        },
      },
      required: ["type", "widgets"],
    },
  ],
} as const;

/**
 * Validate UI-DSL object against schema
 * 
 * Note: This is a basic validation. For production, use a proper JSON Schema validator
 * like ajv or zod (which we'll use for runtime validation).
 */
export function validateUiDsl(dsl: unknown): dsl is UiDsl {
  if (typeof dsl !== 'object' || dsl === null) {
    return false;
  }

  const obj = dsl as Record<string, any>;

  if (!obj.type || typeof obj.type !== 'string') {
    return false;
  }

  switch (obj.type) {
    case 'form':
      return Array.isArray(obj.fields) && obj.fields.length > 0;
    case 'page':
      return Array.isArray(obj.sections) && obj.sections.length > 0;
    case 'table':
      return Array.isArray(obj.columns) && obj.columns.length > 0 && typeof obj.dataSource === 'string';
    case 'dashboard':
      return Array.isArray(obj.widgets) && obj.widgets.length > 0;
    default:
      return false;
  }
}

