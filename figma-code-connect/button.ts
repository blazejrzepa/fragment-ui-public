/**
 * Figma Code Connect mapping for Button component
 * 
 * This file maps the Figma "Button" component to the Fragment UI Button component.
 * 
 * To use this:
 * 1. Install Figma Code Connect: npm install -g @figma/code-connect
 * 2. Update the figmaNode URL with your actual Figma file URL
 * 3. Run: npx @figma/code-connect generate
 */

import { codeConnect } from "figma-code-connect";
import { Button } from "../packages/ui/src/button";
import { ArrowRight, Check } from "lucide-react";

codeConnect.define({
  figmaNode: "https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System?node-id=1304-13481",
  figmaComponentName: "Button",
  codeComponent: Button,
  variants: {
    // Map Figma variant properties to code props
    variant: {
      "solid": { variant: "solid" },
      "outline": { variant: "outline" },
      "ghost": { variant: "ghost" },
    },
    size: {
      "sm": { size: "sm" },
    },
    icons: {
      "leading": { leadingIcon: <ArrowRight className="w-4 h-4" /> },
      "trailing": { trailingIcon: <Check className="w-4 h-4" /> },
    },
  },
  example: {
    props: {
      variant: "solid",
      size: "sm",
      children: "Button",
    },
  },
});

