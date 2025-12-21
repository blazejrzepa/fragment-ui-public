/**
 * Parser: Prompt → UI-DSL
 * 
 * Converts natural language prompts into UI-DSL format
 */

import type { UIDSL, Field, ValidationRule, ScaffoldType, Action } from "./types";

/**
 * Parse a prompt into UI-DSL format
 */
export function parsePromptToUIDSL(prompt: string): UIDSL {
  // Clean prompt first - remove code blocks and modification phrases
  let cleanPrompt = prompt;
  cleanPrompt = cleanPrompt.replace(/```[\s\S]*?```/g, '');
  cleanPrompt = cleanPrompt.replace(/modify\s+the\s+existing\s+component[^:]*:?\s*/i, '');
  cleanPrompt = cleanPrompt.replace(/here\s+is\s+the\s+current\s+code[^:]*:?\s*/i, '');
  cleanPrompt = cleanPrompt.replace(/current\s+code[^:]*:?\s*/i, '');
  
  // If prompt contains code-like patterns, extract only the intent part
  if (prompt.includes('import ') || prompt.includes('function ') || prompt.includes('export ')) {
    const modificationMatch = prompt.match(/^(.*?)(?:```|import|function|export)/i);
    if (modificationMatch && modificationMatch[1]) {
      cleanPrompt = modificationMatch[1].trim();
    }
  }
  
  const lowerPrompt = cleanPrompt.toLowerCase();
  
  // Detect type
  let type: "form" | "screen" | "app" = "form";
  if (lowerPrompt.includes("aplikacja") || lowerPrompt.includes("application") || 
      lowerPrompt.includes("flow") || lowerPrompt.includes("przepływ")) {
    type = "app";
  } else if (lowerPrompt.includes("ekran") || lowerPrompt.includes("screen") || 
             lowerPrompt.includes("strona") || lowerPrompt.includes("page")) {
    type = "screen";
  }
  
  // Detect scaffold
  let scaffold: ScaffoldType | undefined = undefined;
  if (lowerPrompt.includes("rejestrac") || lowerPrompt.includes("registration") || 
      lowerPrompt.includes("auth") || lowerPrompt.includes("logowanie") || 
      lowerPrompt.includes("login") || lowerPrompt.includes("sign")) {
    scaffold = "form-auth";
  } else if (lowerPrompt.includes("settings") || lowerPrompt.includes("ustawienia")) {
    scaffold = "settings-page";
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("panel")) {
    scaffold = "dashboard";
  } else if (lowerPrompt.includes("two column") || lowerPrompt.includes("dwie kolumny")) {
    scaffold = "two-column";
  }
  
  // Extract title - improved pattern matching
  let title: string | undefined = undefined;
  
  // Pattern 1: "formularz rejestracyjny" or "registration form" (use cleanPrompt)
  const titlePattern1 = cleanPrompt.match(/(?:formularz|form|ekran|screen|aplikacja|app|strona|page)\s+([a-ząćęłńóśźż\s]+?)(?:\s|$|z|with|:)/i);
  if (titlePattern1 && titlePattern1[1]) {
    title = titlePattern1[1].trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  
  // Pattern 2: "Zbuduj formularz X" or "Create form X" (use cleanPrompt)
  if (!title) {
    const titlePattern2 = cleanPrompt.match(/(?:zbuduj|stwórz|create|build|make)\s+(?:formularz|form|ekran|screen)\s+([a-ząćęłńóśźż\s]+?)(?:\s|$|z|with|:)/i);
    if (titlePattern2 && titlePattern2[1]) {
      title = titlePattern2[1].trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }
  }
  
  // Pattern 3: Extract from common form types
  if (!title) {
    if (scaffold === "form-auth") {
      title = lowerPrompt.includes("rejestrac") || lowerPrompt.includes("registration") || lowerPrompt.includes("sign up")
        ? "Create Your Account"
        : "Sign In";
    } else if (lowerPrompt.includes("kontakt") || lowerPrompt.includes("contact")) {
      title = "Contact Us";
    } else if (lowerPrompt.includes("logowanie") || lowerPrompt.includes("login")) {
      title = "Sign In";
    }
  }
  
  // Extract fields (reuse logic from existing extractFieldsFromPrompt)
  // Pass cleanPrompt to avoid parsing code as fields
  let fields = extractFieldsFromPrompt(cleanPrompt);
  
  // If no fields found, try to use form template based on detected type
  if (fields.length === 0 && scaffold === "form-auth") {
    // Use registration form template as fallback
    fields = [
      {
        name: "email",
        label: "Email",
        component: "Input",
        placeholder: "your.email@example.com",
        helperText: "We'll never share your email with anyone else.",
        required: true,
        validation: [
          { type: "email" },
          { type: "required" },
        ],
      },
      {
        name: "password",
        label: "Password",
        component: "Input",
        placeholder: "Create a strong password",
        helperText: "Must be at least 8 characters with uppercase, lowercase, and numbers.",
        required: true,
        validation: [
          { type: "minLength", value: 8 },
          { type: "required" },
        ],
      },
    ];
  }
  
  // Extract actions (use cleanPrompt)
  const actions = extractActionsFromPrompt(cleanPrompt);
  
  // Extract description if available (use cleanPrompt)
  let description: string | undefined = undefined;
  const descMatch = cleanPrompt.match(/(?:description|opis|about|o)\s*:?\s*([^\.]+?)(?:\.|$)/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  } else if (scaffold === "form-auth") {
    description = lowerPrompt.includes("rejestrac") || lowerPrompt.includes("registration")
      ? "Join us today! Fill out the form below to create your account and get started."
      : "Sign in to your account to continue.";
  }
  
  return {
    type,
    title,
    description,
    fields: fields.length > 0 ? fields : undefined,
    actions,
    scaffold,
    layout: {
      maxWidth: "md",
      gap: "6",
    },
    metadata: {
      source: prompt,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Extract fields from prompt (improved logic with better pattern matching)
 */
function extractFieldsFromPrompt(prompt: string): Field[] {
  // Note: prompt is already cleaned in parsePromptToUIDSL, but we do additional cleaning here
  // for safety (in case this function is called directly)
  let cleanPrompt = prompt;
  
  // Remove code blocks (```typescript ... ``` or ``` ... ```)
  cleanPrompt = cleanPrompt.replace(/```[\s\S]*?```/g, '');
  
  // Remove "Modify the existing component" and similar modification phrases
  cleanPrompt = cleanPrompt.replace(/modify\s+the\s+existing\s+component[^:]*:?\s*/i, '');
  cleanPrompt = cleanPrompt.replace(/here\s+is\s+the\s+current\s+code[^:]*:?\s*/i, '');
  cleanPrompt = cleanPrompt.replace(/current\s+code[^:]*:?\s*/i, '');
  
  // If prompt contains code-like patterns (imports, function declarations), it's likely a modification request
  // In that case, try to extract intent from the beginning of the prompt
  if (prompt.includes('import ') || prompt.includes('function ') || prompt.includes('export ')) {
    // Extract only the modification request part (before code block)
    const modificationMatch = prompt.match(/^(.*?)(?:```|import|function|export)/i);
    if (modificationMatch && modificationMatch[1]) {
      cleanPrompt = modificationMatch[1].trim();
    } else {
      // If we can't extract intent, return empty (don't try to parse code as fields)
      return [];
    }
  }
  
  // If cleanPrompt is too short or looks like code, return empty
  if (cleanPrompt.length < 3 || cleanPrompt.match(/^(import|export|function|const|let|var)\s/)) {
    return [];
  }
  
  // Multiple patterns to catch different ways of specifying fields
  const patterns = [
    // Pattern 1: "z polami: email, hasło i numer telefonu" or "with fields: email, password"
    /(?:z\s+polami|with\s+fields?|fields?|pola|containing|zawierający)\s*:?\s*([^\.\n]+?)(?:\.|$|\n)/i,
    // Pattern 2: "email, hasło i numer telefonu" (bez "z polami") - look for list pattern
    /(?:,\s*)?([a-ząćęłńóśźż\s]+?)\s+(?:,|i\s+|and\s+|or\s+)([a-ząćęłńóśźż\s]+?)\s+(?:i\s+|and\s+|or\s+)([a-ząćęłńóśźż\s]+?)(?:\s|$|\.)/i,
    // Pattern 3: "pola A, B i C" or "fields A, B and C"
    /(?:pola|fields?)\s+([A-Z])\s*,\s*([A-Z])\s+(?:i|and)\s+([A-Z])/i,
    // Pattern 4: "z polami A, B, C"
    /(?:z\s+polami|with\s+fields?)\s+([A-Z])\s*,\s*([A-Z])\s*,\s*([A-Z])/i,
    // Pattern 5: "imię, nazwisko, email" (simple comma-separated list)
    /(?:^|\.|,)\s*([a-ząćęłńóśźż\s]+?)\s*,\s*([a-ząćęłńóśźż\s]+?)\s*,\s*([a-ząćęłńóśźż\s]+?)(?:\s|$|\.|,)/i,
  ];
  
  let fieldText = "";
  
  // Try each pattern (use cleanPrompt, not original prompt)
  for (const pattern of patterns) {
    const match = cleanPrompt.match(pattern);
    if (match) {
      // Extract the field list from the match
      if (match[1] && match[2] && match[3]) {
        // Pattern with 3 groups (like "A, B, C" or "email, hasło, telefon")
        fieldText = [match[1], match[2], match[3]].filter(Boolean).join(", ");
      } else if (match[1]) {
        // Pattern with single group (like "z polami: email, hasło")
        fieldText = match[1].trim();
      }
      if (fieldText) break;
    }
  }
  
  // If no pattern matched, try to find common field names in the clean prompt
  if (!fieldText || fieldText.length < 3) {
    const commonFields = [
      "email", "e-mail", "hasło", "haslo", "password", "telefon", "phone", 
      "imię", "imie", "name", "nazwisko", "surname", "wiadomość", "wiadomosc", 
      "message", "adres", "address", "miasto", "city", "kod", "code", "postal"
    ];
    
    const foundFields: string[] = [];
    for (const field of commonFields) {
      // Only check in clean prompt, and make sure it's not part of code
      if (cleanPrompt.toLowerCase().includes(field) && 
          !cleanPrompt.toLowerCase().includes(`import.*${field}`) &&
          !cleanPrompt.toLowerCase().includes(`function.*${field}`)) {
        foundFields.push(field);
      }
    }
    
    if (foundFields.length > 0) {
      fieldText = foundFields.join(", ");
    }
  }
  
  if (!fieldText || fieldText.length < 3) {
    return [];
  }
  
  // Normalize and split field text
  let normalizedText = fieldText
    .replace(/\s+and\s+/gi, ", ")
    .replace(/\s+or\s+/gi, ", ");
  
  // Handle " i " separator - split on " i " but preserve multi-word fields
  const parts = normalizedText.split(/\s+i\s+/i);
  
  let fieldNames: string[] = [];
  if (parts.length > 1) {
    parts.forEach((part) => {
      if (part.includes(',')) {
        const subParts = part.split(',').map(p => p.trim()).filter(p => p);
        fieldNames.push(...subParts);
      } else {
        fieldNames.push(part.trim());
      }
    });
  } else {
    fieldNames = normalizedText
      .split(/,/)
      .map(f => f.trim())
      .filter(f => f.length > 0);
  }
  
  if (fieldNames.length === 0) {
    return [];
  }
  
  return fieldNames.map((name) => {
    const cleanName = name.trim().toLowerCase();
    let component: Field["component"] = "Input";
    let placeholder = "";
    let helperText: string | undefined;
    const validation: ValidationRule[] = [];
    
    // Enhanced component type detection
    if (cleanName.includes("email") || cleanName.includes("e-mail")) {
      component = "Input";
      placeholder = "your.email@example.com";
      helperText = "We'll never share your email with anyone else.";
      validation.push({ type: "email" });
      validation.push({ type: "required" });
    } else if (cleanName.includes("password") || cleanName.includes("hasło") || cleanName.includes("haslo")) {
      component = "Input";
      placeholder = "Create a strong password";
      helperText = "Must be at least 8 characters with uppercase, lowercase, and numbers.";
      validation.push({ type: "minLength", value: 8 });
      validation.push({ type: "required" });
    } else if (cleanName.includes("phone") || cleanName.includes("telefon") || 
               (cleanName.includes("numer") && cleanName.includes("telefon"))) {
      component = "Input";
      placeholder = "+1 (555) 123-4567";
      helperText = "Optional. We'll use this for important account updates.";
      validation.push({ type: "pattern", value: "^[+]?[0-9\\s\\-()]+$" });
    } else if (cleanName.includes("message") || cleanName.includes("wiadomość") || cleanName.includes("wiadomosc") ||
               cleanName.includes("comment") || cleanName.includes("komentarz")) {
      component = "Textarea";
      placeholder = "Enter your message...";
      validation.push({ type: "minLength", value: 10 });
      validation.push({ type: "maxLength", value: 1000 });
    } else if (cleanName.includes("checkbox") || cleanName.includes("zgoda") || cleanName.includes("rodo") || 
               cleanName.includes("terms") || cleanName.includes("accept")) {
      component = "Checkbox";
      validation.push({ type: "required" });
    } else if (cleanName.includes("select") || cleanName.includes("wybierz") || cleanName.includes("dropdown") ||
               cleanName.includes("kategoria") || cleanName.includes("category") || cleanName.includes("country") ||
               cleanName.includes("kraj") || cleanName.includes("status")) {
      component = "Select";
      placeholder = "Select an option...";
    } else if (cleanName.includes("date") || cleanName.includes("data") || cleanName.includes("urodzin")) {
      component = "DatePicker";
      placeholder = "Select date";
    } else if (cleanName.includes("file") || cleanName.includes("plik") || cleanName.includes("upload")) {
      component = "FileUpload";
      placeholder = "Choose file";
    }
    
    // Extract validation from clean prompt if mentioned
    const lowerPrompt = cleanPrompt.toLowerCase();
    if (lowerPrompt.includes("wymagane") || lowerPrompt.includes("required") || 
        lowerPrompt.includes("obowiązkowe") || lowerPrompt.includes("mandatory")) {
      if (!validation.some(v => v.type === "required")) {
        validation.push({ type: "required" });
      }
    }
    
    // Extract min/max length from clean prompt
    const minLengthMatch = cleanPrompt.match(/(?:min|minimum|co najmniej)\s+(\d+)\s*(?:znak|character)/i);
    if (minLengthMatch) {
      validation.push({ type: "minLength", value: parseInt(minLengthMatch[1]) });
    }
    
    const maxLengthMatch = cleanPrompt.match(/(?:max|maximum|maksymalnie)\s+(\d+)\s*(?:znak|character)/i);
    if (maxLengthMatch) {
      validation.push({ type: "maxLength", value: parseInt(maxLengthMatch[1]) });
    }
    
    // Generate label from name
    const label = name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    
    return {
      name: cleanName.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
      label,
      component,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      helperText,
      required: validation.some(v => v.type === "required"),
      validation: validation.length > 0 ? validation : undefined,
    };
  });
}

/**
 * Extract actions from prompt (improved with better button detection)
 */
function extractActionsFromPrompt(prompt: string): Action[] {
  const actions: Action[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect button labels from prompt
  let submitLabel = "Submit";
  
  // Polish labels
  if (lowerPrompt.includes("zarejestruj") || lowerPrompt.includes("rejestracja")) {
    submitLabel = "Zarejestruj się";
  } else if (lowerPrompt.includes("zaloguj") || lowerPrompt.includes("logowanie")) {
    submitLabel = "Zaloguj się";
  } else if (lowerPrompt.includes("wyślij") || lowerPrompt.includes("wyslij")) {
    submitLabel = "Wyślij";
  } else if (lowerPrompt.includes("zapisz") || lowerPrompt.includes("save")) {
    submitLabel = "Zapisz";
  } else if (lowerPrompt.includes("utwórz") || lowerPrompt.includes("utworz") || lowerPrompt.includes("create")) {
    submitLabel = "Utwórz";
  }
  
  // English labels
  if (lowerPrompt.includes("sign up") || lowerPrompt.includes("register")) {
    submitLabel = "Sign Up";
  } else if (lowerPrompt.includes("sign in") || lowerPrompt.includes("login")) {
    submitLabel = "Sign In";
  } else if (lowerPrompt.includes("send")) {
    submitLabel = "Send";
  } else if (lowerPrompt.includes("save")) {
    submitLabel = "Save";
  } else if (lowerPrompt.includes("create")) {
    submitLabel = "Create";
  }
  
  // Custom button labels from quotes
  const submitMatch = prompt.match(/(?:przycisk|button|submit|label)\s+["']([^"']+)["']/i);
  if (submitMatch) {
    submitLabel = submitMatch[1];
  }
  
  // Default submit button
  if (lowerPrompt.includes("formularz") || lowerPrompt.includes("form") || 
      lowerPrompt.includes("submit") || lowerPrompt.includes("wyślij") ||
      lowerPrompt.includes("button") || lowerPrompt.includes("przycisk")) {
    actions.push({
      type: "submit",
      label: submitLabel,
      variant: "primary",
    });
  }
  
  // Detect cancel/secondary button
  if (lowerPrompt.includes("anuluj") || lowerPrompt.includes("cancel") || 
      lowerPrompt.includes("wstecz") || lowerPrompt.includes("back")) {
    actions.push({
      type: "button",
      label: lowerPrompt.includes("anuluj") ? "Anuluj" : "Cancel",
      variant: "secondary",
    });
  }
  
  return actions.length > 0 ? actions : [{
    type: "submit",
    label: submitLabel,
    variant: "primary",
  }];
}

