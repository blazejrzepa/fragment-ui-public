/**
 * AST Synchronization (TSX → DSL)
 * 
 * One-way synchronization from manually edited TSX code back to DSL.
 * Uses Babel AST parser to extract changes and update DSL structure.
 * 
 * v1.1: AST sync for conversational UI editing.
 * 
 * Note: This is a simplified implementation. Full AST parsing would require
 * @babel/parser and @babel/traverse. For now, we provide a basic structure.
 */

import type { UiDsl } from './types';
import type { Patch } from './patch';

export interface ASTSyncResult {
  success: boolean;
  patches: Patch[];
  warnings: string[];
  errors: string[];
}

/**
 * Sync TSX code changes back to DSL
 * 
 * This is a placeholder implementation. In production, this would:
 * 1. Parse TSX with @babel/parser
 * 2. Traverse AST with @babel/traverse
 * 3. Extract changes (props, children, structure)
 * 4. Generate patches to update DSL
 * 
 * For now, we provide a basic structure that can be extended.
 */
export function syncTSXToDSL(
  tsxCode: string,
  currentDsl: UiDsl
): ASTSyncResult {
  const patches: Patch[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Basic validation - check if code is valid TSX
  if (!tsxCode || tsxCode.trim().length === 0) {
    errors.push('TSX code is empty');
    return { success: false, patches, warnings, errors };
  }
  
  // Check for React component structure
  if (!tsxCode.includes('export default') && !tsxCode.includes('export function')) {
    warnings.push('TSX code does not appear to be a React component');
  }
  
  // Extract data-ui-id attributes to map TSX elements to DSL nodes
  const uiIdMatches = tsxCode.matchAll(/data-ui-id=["']([^"']+)["']/g);
  const uiIds = Array.from(uiIdMatches, m => m[1]);
  
  if (uiIds.length === 0) {
    warnings.push('No data-ui-id attributes found in TSX code. Cannot sync to DSL.');
  }
  
  // TODO: Full AST parsing would:
  // 1. Parse TSX with @babel/parser
  // 2. Find JSX elements with data-ui-id
  // 3. Extract props, children, structure
  // 4. Compare with current DSL
  // 5. Generate patches for differences
  
  // For now, return empty patches with a note
  warnings.push('AST sync is not fully implemented. Manual DSL updates required.');
  
  return {
    success: patches.length > 0 || errors.length === 0,
    patches,
    warnings,
    errors,
  };
}

/**
 * Extract props from TSX element (simplified)
 */
export function extractPropsFromTSX(tsxCode: string, uiId: string): Record<string, any> {
  const props: Record<string, any> = {};
  
  // Find element with this uiId
  const elementRegex = new RegExp(`<[^>]+data-ui-id=["']${uiId}["'][^>]*>`, 'g');
  const match = tsxCode.match(elementRegex);
  
  if (match) {
    const element = match[0];
    
    // Extract common props
    const propPatterns = [
      { name: 'variant', pattern: /variant=["']([^"']+)["']/ },
      { name: 'type', pattern: /type=["']([^"']+)["']/ },
      { name: 'label', pattern: /label=["']([^"']+)["']/ },
      { name: 'placeholder', pattern: /placeholder=["']([^"']+)["']/ },
      { name: 'required', pattern: /required/ },
    ];
    
    for (const { name, pattern } of propPatterns) {
      const propMatch = element.match(pattern);
      if (propMatch) {
        if (name === 'required') {
          props[name] = true;
        } else {
          props[name] = propMatch[1];
        }
      }
    }
  }
  
  return props;
}

/**
 * Extract text content from TSX element
 */
export function extractTextFromTSX(tsxCode: string, uiId: string): string | null {
  // Find element and extract text content
  // This is a simplified version - full implementation would parse AST
  const elementRegex = new RegExp(`<[^>]+data-ui-id=["']${uiId}["'][^>]*>([^<]+)</`, 'g');
  const match = tsxCode.match(elementRegex);
  
  if (match) {
    return match[0].replace(/<[^>]+>/, '').replace(/<\/[^>]+>/, '').trim();
  }
  
  return null;
}

