/**
 * Chat Intent Detector
 * 
 * Detects user intent from chat messages:
 * - "generate" - create new component/screen
 * - "edit" - modify existing component/screen
 * - "patch" - apply specific patch operations
 */

export type ChatIntent = "generate" | "edit" | "patch" | "unknown";

export interface IntentDetectionResult {
  intent: ChatIntent;
  confidence: number;
  targetId?: string; // data-ui-id or component id to edit
  patchOperations?: string[]; // Detected patch operations
  metadata?: {
    componentName?: string;
    sectionId?: string;
    property?: string;
    value?: string;
  };
}

/**
 * Keywords for intent detection
 */
const GENERATE_KEYWORDS = [
  "create", "generate", "make", "build", "new", "add", "show me", "give me",
  "stworz", "wygeneruj", "utworz", "dodaj", "pokaż", "daj mi",
];

const EDIT_KEYWORDS = [
  "change", "update", "modify", "edit", "replace", "set", "make it", "turn it",
  "zmień", "zaktualizuj", "edytuj", "zamień", "ustaw", "zrób to",
];

const PATCH_KEYWORDS = [
  "remove", "delete", "add", "move", "wrap", "reorder", "rename",
  "usuń", "dodaj", "przenieś", "opakuj", "zmień kolejność", "zmień nazwę",
];

/**
 * Detect intent from user message
 */
export function detectChatIntent(message: string, context?: {
  currentAssetId?: string;
  currentRevisionId?: string;
  hasExistingDSL?: boolean;
}): IntentDetectionResult {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for generate intent
  const hasGenerateKeywords = GENERATE_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for edit intent
  const hasEditKeywords = EDIT_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for patch intent (specific operations)
  const hasPatchKeywords = PATCH_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // If there's existing DSL/Asset, edit is more likely
  const hasContext = context?.hasExistingDSL || context?.currentAssetId;
  
  // Determine intent
  let intent: ChatIntent = "unknown";
  let confidence = 0.5;
  
  if (hasPatchKeywords) {
    intent = "patch";
    confidence = 0.9;
  } else if (hasEditKeywords && hasContext) {
    intent = "edit";
    confidence = 0.85;
  } else if (hasEditKeywords && !hasContext) {
    // Edit without context might be generate
    intent = "generate";
    confidence = 0.6;
  } else if (hasGenerateKeywords) {
    intent = "generate";
    confidence = 0.8;
  } else if (hasContext) {
    // If we have context and no clear intent, assume edit
    intent = "edit";
    confidence = 0.6;
  }
  
  // Extract target ID from message (e.g., "change button-1" or "update #section-1")
  const targetIdMatch = lowerMessage.match(/(?:button|section|component|element)[\s-]?([a-z0-9-]+)/i) ||
                       lowerMessage.match(/#([a-z0-9-]+)/i) ||
                       lowerMessage.match(/data-ui-id="([^"]+)"/i);
  const targetId = targetIdMatch ? targetIdMatch[1] : undefined;
  
  // Extract patch operations
  const patchOperations: string[] = [];
  if (lowerMessage.includes("remove") || lowerMessage.includes("delete") || lowerMessage.includes("usuń")) {
    patchOperations.push("removeNode");
  }
  if (lowerMessage.includes("add") || lowerMessage.includes("dodaj")) {
    patchOperations.push("addNode");
  }
  if (lowerMessage.includes("move") || lowerMessage.includes("przenieś")) {
    patchOperations.push("moveNode");
  }
  if (lowerMessage.includes("wrap") || lowerMessage.includes("opakuj")) {
    patchOperations.push("wrapWith");
  }
  if (lowerMessage.includes("change") || lowerMessage.includes("set") || lowerMessage.includes("zmień") || lowerMessage.includes("ustaw")) {
    patchOperations.push("setProp");
  }
  
  // Extract metadata
  const metadata: IntentDetectionResult["metadata"] = {};
  
  // Extract component name
  const componentMatch = lowerMessage.match(/(?:component|element|widget)\s+([a-z]+)/i);
  if (componentMatch) {
    metadata.componentName = componentMatch[1];
  }
  
  // Extract property and value
  const propertyMatch = lowerMessage.match(/(?:set|change|make)\s+(\w+)\s+(?:to|as|=)\s+["']?([^"'\s]+)["']?/i);
  if (propertyMatch) {
    metadata.property = propertyMatch[1];
    metadata.value = propertyMatch[2];
  }
  
  return {
    intent,
    confidence,
    targetId: targetId || context?.currentAssetId,
    patchOperations: patchOperations.length > 0 ? patchOperations : undefined,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

/**
 * Check if message is a question (not an action)
 */
export function isQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  const questionWords = ["what", "how", "why", "when", "where", "which", "who", "co", "jak", "dlaczego", "kiedy", "gdzie", "który"];
  const questionEndings = ["?", "?"];
  
  return questionWords.some(word => lowerMessage.startsWith(word)) ||
         questionEndings.some(ending => lowerMessage.endsWith(ending));
}

