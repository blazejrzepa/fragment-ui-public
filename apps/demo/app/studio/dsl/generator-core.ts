/**
 * Core generator function - main dispatcher for UI-DSL to TSX conversion
 * Separated to avoid circular dependencies
 */

import type { UiDsl } from './types';
import type { GeneratorOptions } from './generator';
import { generateForm } from './generators/form-generator';
import { generateTable } from './generators/table-generator';
import { generateDashboard } from './generators/dashboard-generator';
import { generatePage } from './generators/page-generator';
import { generateDecision } from './generator-decision';

const DEFAULT_OPTIONS: GeneratorOptions = {
  useFormEnhanced: true,
  includeImports: true,
  includeValidation: true,
};

/**
 * Generate TSX code from UI-DSL
 */
export function generateTSX(dsl: UiDsl, options: GeneratorOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  switch (dsl.type) {
    case 'form':
      return generateForm(dsl, opts);
    case 'page':
    case 'screen': // Screen is alias for page with regions
      return generatePage(dsl, opts);
    case 'table':
      return generateTable(dsl, opts);
    case 'dashboard':
      return generateDashboard(dsl, opts);
    case 'decision':
      return generateDecision(dsl, opts);
    default:
      throw new Error(`Unknown DSL type: ${(dsl as any).type}`);
  }
}

