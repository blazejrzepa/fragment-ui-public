import { PropDefinition } from "../components/component-playground/props-editor";

/**
 * Define editable props for each component
 * This is a simplified version - in a real scenario, you might want to
 * introspect TypeScript types or use a schema
 */
export const COMPONENT_PROPS: Record<string, PropDefinition[]> = {
  button: [
    {
      name: "variant",
      type: "select",
      defaultValue: "solid",
      options: ["solid", "outline", "ghost"],
      description: "Button variant",
    },
    {
      name: "size",
      type: "select",
      defaultValue: "md",
      options: ["sm", "md", "lg"],
      description: "Button size",
    },
    {
      name: "children",
      type: "string",
      defaultValue: "Button",
      description: "Button text",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: false,
      description: "Disable the button",
    },
  ],
  input: [
    {
      name: "type",
      type: "select",
      defaultValue: "text",
      options: ["text", "email", "password", "number", "tel", "url"],
      description: "Input type",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Enter text...",
      description: "Placeholder text",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: false,
      description: "Disable the input",
    },
  ],
  badge: [
    {
      name: "variant",
      type: "select",
      defaultValue: "solid",
      options: ["solid", "outline", "subtle"],
      description: "Badge variant",
    },
    {
      name: "size",
      type: "select",
      defaultValue: "md",
      options: ["sm", "md"],
      description: "Badge size",
    },
    {
      name: "children",
      type: "string",
      defaultValue: "Badge",
      description: "Badge text",
    },
  ],
  breadcrumbs: [
    {
      name: "items",
      type: "text",
      defaultValue: JSON.stringify([
        { label: "Home", href: "/" },
        { label: "Components", href: "/components" },
        { label: "Current" },
      ]),
      description: "Breadcrumb items (JSON array)",
    },
  ],
  card: [
    {
      name: "className",
      type: "string",
      defaultValue: "",
      description: "Additional CSS classes",
    },
  ],
  carousel: [
    {
      name: "autoPlay",
      type: "boolean",
      defaultValue: false,
      description: "Enable auto-play",
    },
    {
      name: "autoPlayInterval",
      type: "number",
      defaultValue: 3000,
      description: "Auto-play interval (ms)",
    },
    {
      name: "showArrows",
      type: "boolean",
      defaultValue: true,
      description: "Show navigation arrows",
    },
    {
      name: "showDots",
      type: "boolean",
      defaultValue: true,
      description: "Show dots pagination",
    },
  ],
  tabs: [
    {
      name: "defaultValue",
      type: "string",
      defaultValue: "tab1",
      description: "Default tab value",
    },
  ],
  "authentication-block": [
    {
      name: "mode",
      type: "select",
      defaultValue: "login",
      options: ["login", "signup", "reset"],
      description: "Authentication mode",
    },
    {
      name: "showSocialLogin",
      type: "boolean",
      defaultValue: true,
      description: "Show social login buttons",
    },
    {
      name: "error",
      type: "string",
      defaultValue: "",
      description: "Error message (optional)",
    },
  ],
  "pricing-table": [
    {
      name: "tiers",
      type: "text",
      defaultValue: JSON.stringify([
        {
          name: "Starter",
          description: "For individuals",
          price: "$9",
          pricePeriod: "/month",
          features: [
            { name: "5 Projects", included: true },
            { name: "Basic Support", included: true },
          ],
          ctaText: "Get Started",
        },
      ]),
      description: "Pricing tiers (JSON array)",
    },
  ],
};

/**
 * Get props definition for a component
 */
export function getComponentProps(componentName: string): PropDefinition[] {
  return COMPONENT_PROPS[componentName] || [];
}

