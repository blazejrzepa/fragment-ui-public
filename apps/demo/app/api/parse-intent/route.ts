import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { Patch, NodeRef } from "../../studio/dsl/patch";
import type { UiDsl } from "../../studio/dsl/types";

/**
 * API Route for parsing natural language commands into Patch operations using AI
 * 
 * This endpoint uses OpenAI to interpret user intent and convert it to structured patch operations.
 * This allows users to write naturally instead of using precise commands.
 */

// Initialize OpenAI client (if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

interface ParseIntentRequest {
  command: string;
  dsl: UiDsl | null; // Can be null - AI will analyze code to generate DSL
  selectedElementId?: string;
  elementContext?: {
    subtree?: any; // DSL subtree snapshot of selected element
    allowedProps?: Record<string, any>; // Allowed props from registry
    componentName?: string; // Component name (e.g., "Button", "Input")
  };
  context?: {
    code?: string;
    messages?: Array<{ role: "user" | "assistant"; content: string }>;
  };
}

const SYSTEM_PROMPT = `You are an expert at analyzing React/TSX code and parsing natural language commands into structured patch operations for UI components.

**IMPORTANT: When a selected element is provided:**
- Use the element's subtree snapshot to understand the element's structure and children
- Use the allowed props to validate which properties can be changed
- Apply patches ONLY to the selected element (use target.id = selectedElementId)
- If the command mentions "this", "selected", "current", or "the [component]", it refers to the selected element
- Only use props that are in the allowedProps list - do not suggest invalid prop values

Your task has TWO modes:

MODE 1: If DSL is provided
- Interpret user commands and convert them into JSON patch operations
- Use the existing DSL structure to understand where to add/modify elements

MODE 2: If DSL is NULL (code analysis mode)
- FIRST: Analyze the provided code to understand the component structure
- Generate a DSL representation that accurately reflects the current code
- THEN: Apply the user's command to modify the DSL
- Return both the generated DSL AND the patches

CRITICAL: When analyzing code:
1. Identify the component type:
   - If it's a SINGLE BUTTON or SIMPLE COMPONENT (just one Button, Input, etc. without form wrapper) → type: "page" with a single section containing that component
   - If it's a form (<form>, <Form>, form fields, submit buttons) → type: "form"
   - If it's a page/screen with sections → type: "page"
   - If it's a single block component (NavigationHeader, Card, etc.) → type: "page" with sections
   
2. Understand the structure:
   - SINGLE BUTTON: <Button>Text</Button> → page with one section containing one button node
   - NavigationHeader with links → page with navigation section
   - Form with inputs → form with fields[]
   - Page with multiple sections → page with sections[]
   
3. Preserve existing structure:
   - For SINGLE COMPONENTS (button, input, etc.): Keep the component structure exactly as is, only modify the requested property
   - Don't replace the component, ADD to it (unless it's a single component - then modify it in place)
   - Maintain existing props, links, structure
   - Add new elements in appropriate places
   
4. IMPORTANT for single components:
   - If code shows a single Button/Input/etc. without form wrapper, it's a SIMPLE COMPONENT
   - Generate DSL as: { type: "page", id: "...", sections: [{ id: "...", kind: "content", content: [{ id: "button-1", type: "button", label: "..." }] }] }
   - When applying patches to simple components, modify the existing node, don't create a new structure

Available patch operations:
1. addNode - Add a new component
   - For forms: buttons → "actions" array, inputs → "fields" array
   - For pages: components → "sections" array
   - For dashboards: widgets → "widgets" array (use parent.id = dashboard.id)
2. removeNode - Remove a component
3. setCopy - Change text/label/title/placeholder
4. setProp - Set a property (variant, size, required, etc.)

**CRITICAL for Dashboards:**
- When adding to dashboard, parent MUST be the dashboard root (use dashboard.id, not "dashboard-container")
- Dashboard root ID is the dashboard's "id" field, NOT "dashboard-container"
- If code has data-ui-id="dashboard-container", find the actual dashboard.id from DSL
- For "add more charts" → add widget with kind: "chart" to widgets array
- For "add top navigation" → this requires converting dashboard to page with regions, or adding as a special widget

DSL Structure:
- Forms: { type: "form", id: "...", fields: [], actions: [] }
- Pages: { type: "page", id: "...", sections: [{ id: "...", kind: "...", content: [...] }] }
- Dashboards: { type: "dashboard", id: "...", widgets: [{ id: "...", kind: "metric" | "chart" | "table", title: "...", data: {...} }] }
  **IMPORTANT for Dashboards:**
  - Dashboards use "widgets" array, NOT "sections"
  - To add elements to dashboard, use parent.id = dashboard.id (the dashboard root)
  - Widgets can be: { kind: "metric", ... }, { kind: "chart", ... }, { kind: "table", ... }
  - To add navigation/header to dashboard, you need to convert it to a page with regions or add as a widget
- Decision Patterns: { type: "decision", id: "...", pattern: "compare-3" | "recommendation" | "tradeoffs" | "review-confirm", options: [...], summary?: "..." }

**DECISION PATTERNS:**
When the user asks for:
- "pricing page with 3 plans" or "compare 3 options" → use pattern: "compare-3"
- "recommendation" or "ranked options" or "best choice" → use pattern: "recommendation"
- "tradeoffs" or "cost vs risk vs time" or "compare dimensions" → use pattern: "tradeoffs"
- "review and confirm" or "checkout" or "final confirmation" → use pattern: "review-confirm"

For decision patterns, generate DSL with:
- type: "decision"
- pattern: one of the 4 patterns above
- options: array of option objects (each with id, name, description, and pattern-specific properties)
- summary: optional description

IMPORTANT: Understand natural language:
- "dodaj drugi button" = "add second button" = add another button
- "zmień tytuł" = "change title"
- "usuń" = "remove" = "delete"

Return JSON in this format:
{
  "dsl": { ... } (if DSL was null, return generated DSL; if DSL was provided, return null),
  "patches": [
    {
      "op": "addNode" | "removeNode" | "setCopy" | "setProp",
      "target": { "type": "byId", "id": "..." },
      "parent": { "type": "byId", "id": "..." } (for addNode),
      "node": { "id": "uuid", "type": "...", "label": "...", "variant": "..." } (for addNode),
      "path": "label" | "title" | "placeholder" (for setCopy),
      "value": "..." (for setCopy/setProp),
      "prop": "variant" | "size" | "required" (for setProp)
    }
  ],
  "confidence": 0.0-1.0,
  "error": null or error message
}

Example 1 - Simple button component:
Code: 
\`\`\`tsx
export default function OriginalButton() {
  return (
    <Button data-ui-id="button-test" variant="solid">
      Test Button
    </Button>
  );
}
\`\`\`
Command: "Zmień tekst na 'Zapisz'"
Response: {
  "dsl": {
    "type": "page",
    "id": "page-1",
    "sections": [{
      "id": "section-1",
      "kind": "content",
      "content": [{
        "id": "button-test",
        "type": "button",
        "label": "Test Button",
        "variant": "solid"
      }]
    }]
  },
  "patches": [{
    "op": "setCopy",
    "target": { "type": "byId", "id": "button-test" },
    "path": "label",
    "value": "Zapisz"
  }],
  "confidence": 0.95
}

Example 2 - NavigationHeader:
Code: <NavigationHeader links={[...]} />
Command: "dodaj drugi button"
Response: {
  "dsl": {
    "type": "page",
    "id": "generated-id",
    "sections": [{
      "id": "nav-section",
      "kind": "navigation",
      "content": [/* NavigationHeader structure */]
    }]
  },
  "patches": [{
    "op": "addNode",
    "parent": { "type": "byId", "id": "nav-section" },
    "node": { "id": "button-2", "type": "button", "label": "Button", "variant": "primary" }
  }],
  "confidence": 0.9
}

Be precise, understand context, preserve existing structure, and return valid JSON only.`;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { 
          error: "AI parsing not available. Please configure OPENAI_API_KEY environment variable.",
          fallback: true,
          patches: [],
          confidence: 0,
        },
        { status: 503 }
      );
    }

    const body: ParseIntentRequest = await request.json();
    const { command, dsl, selectedElementId, elementContext, context } = body;

    if (!command || typeof command !== "string") {
      return NextResponse.json(
        { error: "Command is required", patches: [], confidence: 0 },
        { status: 400 }
      );
    }

    // Build prompt - different for code analysis vs DSL patching
    let userPrompt: string;
    
    if (!dsl && context?.code) {
      // MODE 2: Code analysis mode - analyze code and generate DSL + patches
      const codePreview = context.code.substring(0, 4000); // Limit code size
      userPrompt = `Analyze this React/TSX component code and apply the user's command:

Component Code:
\`\`\`tsx
${codePreview}
\`\`\`

User Command: "${command}"
${selectedElementId ? `Selected Element ID: ${selectedElementId}` : ""}
${elementContext?.componentName ? `Selected Component: ${elementContext.componentName}` : ""}
${elementContext?.subtree ? `\nSelected Element Subtree (DSL snapshot):\n${JSON.stringify(elementContext.subtree, null, 2)}` : ""}
${elementContext?.allowedProps ? `\nAllowed Props for ${elementContext.componentName || 'selected component'}:\n${JSON.stringify(elementContext.allowedProps, null, 2)}` : ""}

TASK:
1. Analyze the code structure - what type of component is this? (form, page, block component)
2. Generate a DSL that accurately represents the current code structure
3. Apply the user's command to modify the DSL (add button, change text, etc.)
4. Return both the generated DSL AND the patches to apply

IMPORTANT:
- Preserve the existing component structure COMPLETELY
- Don't replace the component, ADD to it
- If it's a page with regions (header, sidebar, content, footer), preserve ALL regions and their modules/content
- If it's NavigationHeader with links, keep the links and add button to appropriate place
- If it's a form, keep existing fields and add new elements
- If it's a dashboard with sections, preserve ALL sections and their content
- Understand where to add elements based on component structure
- When generating DSL from code, analyze the FULL structure including:
  * All regions (header, sidebar, content, footer) if present
  * All sections and their content
  * All modules within regions
  * All components within sections
- NEVER generate an empty or minimal DSL - always preserve the full structure

Return JSON with "dsl" (generated DSL) and "patches" (operations to apply).`;
    } else if (dsl) {
      // MODE 1: DSL patching mode - use existing DSL
      const dslSummary = JSON.stringify(dsl, null, 2).substring(0, 3000);
      userPrompt = `Parse this command into patch operations:

Command: "${command}"
${selectedElementId ? `Selected Element ID: ${selectedElementId}` : ""}
${elementContext?.componentName ? `Selected Component: ${elementContext.componentName}` : ""}
${elementContext?.subtree ? `\nSelected Element Subtree (DSL snapshot):\n${JSON.stringify(elementContext.subtree, null, 2)}` : ""}
${elementContext?.allowedProps ? `\nAllowed Props for ${elementContext.componentName || 'selected component'}:\n${JSON.stringify(elementContext.allowedProps, null, 2)}` : ""}

Current DSL (first 3000 chars):
${dslSummary}

Return JSON with patches array.`;
    } else {
      return NextResponse.json(
        { error: "Either DSL or code context is required", patches: [], confidence: 0 },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2, // Low temperature for more deterministic parsing
      max_tokens: 1000,
      response_format: { type: "json_object" }, // Force JSON response
    });

    const responseContent = completion.choices[0].message.content || "{}";
    
    try {
      const parsed = JSON.parse(responseContent);
      
      // Validate and return
      return NextResponse.json({
        dsl: parsed.dsl || null, // Generated DSL (if code analysis mode)
        patches: parsed.patches || [],
        confidence: parsed.confidence || 0.5,
        error: parsed.error || null,
        metadata: {
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          method: parsed.dsl ? "ai-code-analysis" : "ai-parsing",
        },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          patches: [],
          confidence: 0,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Parse Intent API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        patches: [],
        confidence: 0,
      },
      { status: 500 }
    );
  }
}

