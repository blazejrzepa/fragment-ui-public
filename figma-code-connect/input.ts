/**
 * Figma Code Connect mapping for Input component
 */

import { codeConnect } from "figma-code-connect";
import { Input } from "../packages/ui/src/input";

codeConnect.define({
  figmaNode: "https://www.figma.com/file/YOUR_FILE_ID/Design-System?node-id=YOUR_NODE_ID",
  figmaComponentName: "Input",
  codeComponent: Input,
  variants: {
    state: {
      "Default": {},
      "Disabled": { disabled: true },
      "Error": { className: "border-[color:var(--color-accent-red)]" },
    },
    type: {
      "Text": { type: "text" },
      "Email": { type: "email" },
      "Password": { type: "password" },
      "Number": { type: "number" },
    },
  },
  example: {
    props: {
      placeholder: "Enter text...",
    },
  },
});

