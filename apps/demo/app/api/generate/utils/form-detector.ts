/**
 * Form detection and parsing utilities
 */

import type { FormField } from "../types";
import { FORM_TEMPLATES } from "../templates/form-templates";

/**
 * Detect form type from prompt
 */
export function detectFormType(prompt: string): string | null {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("rejestrac") || lowerPrompt.includes("registration") || 
      lowerPrompt.includes("sign up") || lowerPrompt.includes("create account") ||
      lowerPrompt.includes("register") || lowerPrompt.includes("zarejestruj")) {
    return "registration";
  }
  
  if (lowerPrompt.includes("kontakt") || lowerPrompt.includes("contact") ||
      lowerPrompt.includes("message") || lowerPrompt.includes("wiadomość") ||
      lowerPrompt.includes("get in touch")) {
    return "contact";
  }
  
  if (lowerPrompt.includes("logowanie") || lowerPrompt.includes("login") ||
      lowerPrompt.includes("sign in") || lowerPrompt.includes("zaloguj")) {
    return "login";
  }
  
  if (lowerPrompt.includes("feedback") || lowerPrompt.includes("review") ||
      lowerPrompt.includes("opinia") || lowerPrompt.includes("ocena") ||
      lowerPrompt.includes("rating")) {
    return "feedback";
  }
  
  if (lowerPrompt.includes("newsletter") || lowerPrompt.includes("subscribe") ||
      lowerPrompt.includes("subskrypcja") || lowerPrompt.includes("newsletter")) {
    return "newsletter";
  }
  
  if (lowerPrompt.includes("password reset") || lowerPrompt.includes("reset hasła") ||
      lowerPrompt.includes("forgot password") || lowerPrompt.includes("zapomniałem hasła") ||
      lowerPrompt.includes("reset password")) {
    return "password-reset";
  }
  
  if (lowerPrompt.includes("profile") || lowerPrompt.includes("profil") ||
      lowerPrompt.includes("edit profile") || lowerPrompt.includes("edytuj profil")) {
    return "profile";
  }
  
  if (lowerPrompt.includes("checkout") || lowerPrompt.includes("płatność") ||
      lowerPrompt.includes("payment") || lowerPrompt.includes("zamówienie")) {
    return "checkout";
  }
  
  return null;
}

/**
 * Extract specific fields from prompt
 */
export function extractFieldsFromPrompt(prompt: string): FormField[] | null {
  // Pattern 1: "z polami: email, hasło i numer telefonu" or "with fields: email, password"
  const pattern1 = prompt.match(/(?:z\s+polami|with\s+fields?|fields?|pola)\s*:?\s*([^\.]+?)(?:\.|$)/i);
  
  // Pattern 2: "email, hasło i numer telefonu" (bez "z polami") - look for list pattern
  const pattern2 = prompt.match(/(?:,\s*)?([a-ząćęłńóśźż\s]+?)\s+(?:,|i\s+|and\s+|or\s+)([a-ząćęłńóśźż\s]+?)\s+(?:i\s+|and\s+|or\s+)([a-ząćęłńóśźż\s]+?)(?:\s|$|\.)/i);
  
  let fieldText = "";
  
  if (pattern1 && pattern1[1]) {
    fieldText = pattern1[1].trim();
  } else if (pattern2) {
    // Combine all matched groups
    fieldText = [pattern2[1], pattern2[2], pattern2[3]].filter(Boolean).join(", ");
  }
  
  if (!fieldText || fieldText.length < 3) return null;
  
  // Split by comma, "i", "and", "or" - handle "numer telefonu" as one field
  // Strategy: replace " i " with comma, but be smart about multi-word fields
  let normalizedText = fieldText
    .replace(/\s+and\s+/gi, ", ")
    .replace(/\s+or\s+/gi, ", ");
  
  // Handle " i " separator - split on " i " but preserve "numer telefonu" type phrases
  // Pattern: word(s) + " i " + word(s) where the second part might be multi-word
  const parts = normalizedText.split(/\s+i\s+/i);
  
  let fieldNames: string[] = [];
  if (parts.length > 1) {
    // If we have " i " separators, process each part
    parts.forEach((part, index) => {
      // If this part contains commas, split it
      if (part.includes(',')) {
        const subParts = part.split(',').map(p => p.trim()).filter(p => p);
        fieldNames.push(...subParts);
      } else {
        fieldNames.push(part.trim());
      }
    });
  } else {
    // No " i " found, just split by comma
    fieldNames = normalizedText
      .split(/,/)
      .map(f => f.trim())
      .filter(f => f.length > 0);
  }
  
  if (fieldNames.length === 0) return null;
  
  return fieldNames.map((name) => {
    const cleanName = name.trim().toLowerCase();
    let type = "text";
    let placeholder = "";
    let helperText: string | undefined;
    let validation: any = {};
    
    // Determine field type and properties
    if (cleanName.includes("email") || cleanName.includes("e-mail")) {
      type = "email";
      placeholder = "your.email@example.com";
      helperText = "We'll never share your email with anyone else.";
      validation = { pattern: "email" };
    } else if (cleanName.includes("password") || cleanName.includes("hasło") || cleanName.includes("haslo")) {
      type = "password";
      placeholder = "Create a strong password";
      helperText = "Must be at least 8 characters with uppercase, lowercase, and numbers.";
      validation = { minLength: 8, pattern: "password" };
    } else if (cleanName.includes("phone") || cleanName.includes("telefon") || (cleanName.includes("numer") && cleanName.includes("telefon"))) {
      type = "tel";
      placeholder = "+1 (555) 123-4567";
      helperText = "Optional. We'll use this for important account updates.";
      validation = { pattern: "phone" };
    } else if (cleanName.includes("name") || cleanName.includes("imię") || cleanName.includes("imie") || cleanName.includes("nazwa")) {
      type = "text";
      placeholder = "John Doe";
      validation = { minLength: 2, maxLength: 50 };
    } else if (cleanName.includes("message") || cleanName.includes("wiadomość") || cleanName.includes("wiadomosc")) {
      type = "textarea";
      placeholder = "Enter your message...";
      validation = { minLength: 10, maxLength: 1000 };
    }
    
    // Generate label from name
    const label = name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    
    return {
      name: cleanName.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
      type,
      label,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      helperText,
      required: true,
      validation: Object.keys(validation).length > 0 ? validation : undefined,
    };
  });
}

/**
 * Parse prompt to extract form fields and requirements
 */
export function parseFormPromptLegacy(prompt: string): {
  fields: FormField[];
  title: string;
  description: string;
  submitText: string;
  successMessage: string;
} {
  // FIRST: Try to extract specific fields from prompt (priority)
  const extractedFields = extractFieldsFromPrompt(prompt);
  
  if (extractedFields && extractedFields.length > 0) {
    // Use extracted fields, but get title/description from form type if detected
    const formType = detectFormType(prompt);
    const template = formType && FORM_TEMPLATES[formType] ? FORM_TEMPLATES[formType] : null;
    
    // Extract title
    const titleMatch = prompt.match(/(?:formularz|form)\s+([a-ząćęłńóśźż\s]+)/i);
    const title = titleMatch 
      ? titleMatch[1].charAt(0).toUpperCase() + titleMatch[1].slice(1)
      : (template?.title || "Form");
    
    return {
      fields: extractedFields,
      title,
      description: template?.description || "Please fill out all required fields.",
      submitText: template?.submitText || "Submit",
      successMessage: template?.successMessage || "Form submitted successfully!",
    };
  }
  
  // SECOND: If no specific fields, use template if form type detected
  const formType = detectFormType(prompt);
  
  if (formType && FORM_TEMPLATES[formType]) {
    const template = FORM_TEMPLATES[formType];
    return {
      fields: template.fields,
      title: template.title,
      description: template.description,
      submitText: template.submitText,
      successMessage: template.successMessage,
    };
  }
  
  // THIRD: Default fallback - create 3 generic fields
  const titleMatch = prompt.match(/(?:formularz|form)\s+([a-ząćęłńóśźż\s]+)/i);
  const title = titleMatch 
    ? titleMatch[1].charAt(0).toUpperCase() + titleMatch[1].slice(1)
    : "Form";
  
  return {
    fields: [
      {
        name: "field_a",
        type: "text",
        label: "Field A",
        placeholder: "Enter field A",
        required: true,
      },
      {
        name: "field_b",
        type: "text",
        label: "Field B",
        placeholder: "Enter field B",
        required: true,
      },
      {
        name: "field_c",
        type: "text",
        label: "Field C",
        placeholder: "Enter field C",
        required: true,
      },
    ],
    title,
    description: "Please fill out all required fields.",
    submitText: "Submit",
    successMessage: "Form submitted successfully!",
  };
}

