/**
 * Test file for ESLint rule: no-uncontracted-actions
 * 
 * This file should trigger ESLint errors for Button components without data-action-* attributes.
 * 
 * To test:
 * 1. Run: cd apps/demo && pnpm lint
 * 2. Check if ESLint reports errors for buttons without data-action-id
 */

import { Button } from "@fragment_ui/ui";

export function TestUncontractedActions() {
  return (
    <div>
      {/* ❌ ERROR: Button without data-action-id should trigger ESLint error */}
      <Button>Click Me</Button>
      
      {/* ❌ ERROR: Button with data-action-id but without data-action-kind should trigger error */}
      <Button data-action-id="action-1">Click Me 2</Button>
      
      {/* ✅ OK: Button with both data-action-id and data-action-kind */}
      <Button 
        data-action-id="action-2"
        data-action-kind="soft"
      >
        Valid Button
      </Button>
      
      {/* ✅ OK: Button with full Action Contract attributes */}
      <Button 
        data-action-id="action-3"
        data-action-kind="hard"
        data-action-risk-level="high"
        data-action-requires-confirmation="true"
      >
        Delete Account
      </Button>
      
      {/* ✅ OK: Regular HTML button (not from @fragment_ui/ui) - should not trigger error */}
      <button type="button">HTML Button</button>
    </div>
  );
}

