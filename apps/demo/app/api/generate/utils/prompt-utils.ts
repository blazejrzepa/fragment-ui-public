/**
 * Prompt analysis utilities
 */

/**
 * Check if prompt is requesting a decision pattern
 */
export function checkIfDecisionPattern(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return (
    (lowerPrompt.includes('pricing') && (lowerPrompt.includes('3') || lowerPrompt.includes('three') || lowerPrompt.includes('plan'))) ||
    (lowerPrompt.includes('compare') && (lowerPrompt.includes('3') || lowerPrompt.includes('three') || lowerPrompt.includes('options'))) ||
    (lowerPrompt.includes('3 plans') || lowerPrompt.includes('three plans')) ||
    (lowerPrompt.includes('pricing page') && lowerPrompt.includes('plan')) ||
    lowerPrompt.includes('recommendation') || lowerPrompt.includes('recommended') || lowerPrompt.includes('ranked') ||
    lowerPrompt.includes('tradeoff') || lowerPrompt.includes('cost vs risk') || lowerPrompt.includes('dimension') ||
    (lowerPrompt.includes('review') && (lowerPrompt.includes('confirm') || lowerPrompt.includes('checkout')))
  );
}

/**
 * Check if prompt is simple enough for rule-based parsing
 */
export function checkIfSimple(prompt: string): boolean {
  const simplePatterns = [
    /formularz.*z polami/i,
    /create.*form.*with fields/i,
    /zbuduj.*formularz/i,
    /formularz rejestracyjny/i,
    /registration form/i,
    /login form/i,
    /simple.*form/i,
    /create.*simple.*form/i,
    /create a simple login form/i, // Explicit pattern for "create a simple login form"
    /create.*registration form/i, // Pattern for "create a simple registration form"
    /create.*form.*with.*email.*password/i, // Pattern for forms with email and password
    /dashboard/i, // Dashboard prompts should use DSL parser
    /stwórz.*dashboard/i, // Polish: "stwórz dashboard"
    /create.*dashboard/i, // English: "create dashboard"
  ];
  
  // If prompt matches simple patterns, use UI-DSL (rule-based)
  // Removed length check to allow longer prompts that still match simple patterns
  if (simplePatterns.some(pattern => pattern.test(prompt))) {
    return true;
  }
  
  return false;
}

