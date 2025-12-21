/**
 * Module generator - dispatches to specific module generators
 */

import type { UiModule, UiCommon } from "../../types";
import type { GeneratorOptions } from "../../generator";
import {
  generateHeroModule,
  generatePricingModule,
  generateFaqModule,
  generateTestimonialsModule,
  generateKpiHeaderModule,
  generateNavigationModule,
  generateFooterModule,
  generateFeaturesModule,
  generateProofModule,
  generateCtaModule,
  generateBreadcrumbsModule,
  generateDataTableSectionModule,
} from "./module-types";

/**
 * Generate module JSX (Milestone 3.1)
 * Returns { jsx: string, imports: string[] } to allow import tracking
 */
export function generateModule(module: UiModule, dsl?: UiCommon, options?: GeneratorOptions): { jsx: string; imports: string[] } {
  const imports: string[] = [];
  let jsx: string;
  
  switch (module.type) {
    case 'hero':
      jsx = generateHeroModule(module);
      break;
    case 'pricing':
      jsx = generatePricingModule(module);
      break;
    case 'faq':
      jsx = generateFaqModule(module);
      break;
    case 'testimonials':
      jsx = generateTestimonialsModule(module);
      imports.push('Card', 'CardContent');
      break;
    case 'kpi-header':
      jsx = generateKpiHeaderModule(module);
      break;
    case 'navigation':
    case 'navigation-header':
    case 'navigation-sidebar':
      jsx = generateNavigationModule(module);
      // Add Input import if search is enabled in header
      if (module.type === 'navigation-header' && module.props?.showSearch !== false) {
        imports.push('Input');
      }
      break;
    case 'footer':
      jsx = generateFooterModule(module);
      break;
    case 'features':
      jsx = generateFeaturesModule(module);
      imports.push('Card', 'CardHeader', 'CardTitle', 'CardContent');
      break;
    case 'proof':
      jsx = generateProofModule(module);
      break;
    case 'cta':
      jsx = generateCtaModule(module);
      imports.push('Button');
      break;
    case 'breadcrumbs':
      jsx = generateBreadcrumbsModule(module);
      break;
    case 'data-table-section':
      jsx = generateDataTableSectionModule(module);
      imports.push('Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell');
      break;
    default:
      jsx = `<div data-ui-id="${module.id}" data-module-type="${module.type}">
        ${module.title ? `<h2>${module.title}</h2>` : ''}
        ${module.description ? `<p>${module.description}</p>` : ''}
      </div>`;
  }
  
  return { jsx, imports };
}

