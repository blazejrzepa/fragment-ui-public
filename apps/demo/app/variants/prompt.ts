/**
 * Prompt template for variant generation
 * 
 * Generates prompts for creating multiple UI-DSL variants from document content.
 */

// Note: extractSections is not currently exported from ingest.ts
// This import is kept for type compatibility but may need to be implemented

export interface DocumentSections {
  title?: string;
  description?: string;
  requirements?: string[];
  sections?: string[];
  fullText?: string;
}

/**
 * Generate prompt for variant generation
 */
export function generateVariantPrompt(
  documentSections: DocumentSections,
  variantCount: number = 3
): string {
  const { title, description, requirements, sections, fullText } = documentSections;
  
  let prompt = `Generate ${variantCount} different UI-DSL variants for a screen based on the following document:\n\n`;
  
  if (title) {
    prompt += `**Title:** ${title}\n\n`;
  }
  
  if (description) {
    prompt += `**Description:** ${description}\n\n`;
  }
  
  if (requirements && requirements.length > 0) {
    prompt += `**Requirements:**\n${requirements.map((r) => `- ${r}`).join("\n")}\n\n`;
  }
  
  if (sections && sections.length > 0) {
    prompt += `**Sections:**\n${sections.map((s) => `- ${s}`).join("\n")}\n\n`;
  }
  
  if (fullText && fullText.length < 5000) {
    // Include full text if it's not too long
    prompt += `**Full Document:**\n${fullText.substring(0, 5000)}\n\n`;
  }
  
  prompt += `**Instructions:**
1. Generate ${variantCount} distinct UI-DSL variants
2. Each variant should represent a different approach to the same screen
3. Variants can differ in:
   - Layout structure (single column, multi-column, grid)
   - Component choices (different input types, button styles)
   - Information hierarchy (what's emphasized)
   - Navigation patterns
4. Each variant must be valid UI-DSL JSON
5. Include a brief description for each variant explaining the design approach

Return a JSON array with ${variantCount} objects, each containing:
- "dsl": UI-DSL object
- "description": Brief explanation of the variant's approach
- "sourceSections": Array of section names from the document that influenced this variant

Example format:
[
  {
    "dsl": { "type": "screen", "children": [...] },
    "description": "Single-column layout with emphasis on form completion",
    "sourceSections": ["Requirements", "User Input"]
  },
  ...
]`;

  return prompt;
}

