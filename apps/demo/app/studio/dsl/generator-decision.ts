/**
 * Generator for Decision Pattern DSL
 * 
 * Generates TSX code for decision patterns using blocks from @fragment_ui/blocks/decision
 */

import type { UiDecision } from './types';
import type { GeneratorOptions } from './generator';

/**
 * Generate decision pattern component
 */
export function generateDecision(dsl: UiDecision, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromBlocks: string[] = [];
  const importsFromUI: string[] = [];

  // Import the appropriate decision block based on pattern
  let blockName: string;
  switch (dsl.pattern) {
    case 'compare-3':
      blockName = 'Compare3';
      importsFromBlocks.push('Compare3');
      break;
    case 'recommendation':
      blockName = 'Recommendation';
      importsFromBlocks.push('Recommendation');
      break;
    case 'tradeoffs':
      blockName = 'Tradeoffs';
      importsFromBlocks.push('Tradeoffs');
      break;
    case 'review-confirm':
      blockName = 'ReviewConfirm';
      importsFromBlocks.push('ReviewConfirm');
      break;
    default:
      throw new Error(`Unknown decision pattern: ${(dsl as any).pattern}`);
  }

  // Build imports
  if (options.includeImports) {
    if (importsFromBlocks.length > 0) {
      imports.push(`import { ${importsFromBlocks.join(', ')} } from "@fragment_ui/blocks/decision";`);
    }
    imports.push('import * as React from "react";');
  }

  // Generate component name
  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : `Generated${blockName}`;

  // Generate props based on pattern
  const props = generateDecisionProps(dsl);

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="max-w-7xl mx-auto p-6" data-ui-id="${dsl.id}">
      <${blockName}${props} />
    </div>
  );
}
`;
}

/**
 * Generate props for decision block based on pattern
 */
function generateDecisionProps(dsl: UiDecision): string {
  const props: string[] = [];

  if (dsl.title) {
    props.push(`title="${dsl.title}"`);
  }

  if (dsl.description || dsl.summary) {
    props.push(`description="${dsl.description || dsl.summary || ''}"`);
  }

  // Generate options/items based on pattern
  switch (dsl.pattern) {
    case 'compare-3':
      if (dsl.options && Array.isArray(dsl.options) && dsl.options.length > 0) {
        // Clean options - remove functions and ensure all values are serializable
        const cleanOptions = dsl.options.map(opt => ({
          id: opt.id || '',
          name: opt.name || '',
          description: opt.description || '',
          price: opt.price || '',
          pricePeriod: opt.pricePeriod || '',
          features: Array.isArray(opt.features) ? opt.features.map((f: any) => ({
            key: f.key || '',
            label: f.label || '',
            value: f.value !== undefined ? f.value : '',
          })) : [],
          ctaText: opt.ctaText || 'Choose',
          popular: opt.popular || false,
          disabled: opt.disabled || false,
          actionContractId: opt.actionContractId || '',
        }));
        props.push(`options={${JSON.stringify(cleanOptions, null, 2)}}`);
      }
      break;
    case 'recommendation':
      if (dsl.options && Array.isArray(dsl.options) && dsl.options.length > 0) {
        const cleanOptions = dsl.options.map(opt => ({
          id: opt.id || '',
          name: opt.name || '',
          description: opt.description || '',
          rank: opt.rank || 1,
          reasoning: opt.reasoning || '',
          score: opt.score !== undefined ? opt.score : undefined,
          ctaText: opt.ctaText || 'Choose',
          actionContractId: opt.actionContractId || '',
        }));
        props.push(`options={${JSON.stringify(cleanOptions, null, 2)}}`);
      }
      break;
    case 'tradeoffs':
      if (dsl.options && Array.isArray(dsl.options) && dsl.options.length > 0) {
        const cleanOptions = dsl.options.map(opt => ({
          id: opt.id || '',
          name: opt.name || '',
          description: opt.description || '',
          dimensions: Array.isArray(opt.dimensions) ? opt.dimensions.map((d: any) => ({
            name: d.name || '',
            value: d.value !== undefined ? d.value : 0,
            label: d.label || '',
          })) : [],
          ctaText: opt.ctaText || 'Choose',
          actionContractId: opt.actionContractId || '',
        }));
        props.push(`options={${JSON.stringify(cleanOptions, null, 2)}}`);
      }
      break;
    case 'review-confirm':
      if ((dsl as any).items && Array.isArray((dsl as any).items)) {
        const cleanItems = (dsl as any).items.map((item: any) => ({
          key: item.key || '',
          label: item.label || '',
          value: item.value || '',
        }));
        props.push(`items={${JSON.stringify(cleanItems, null, 2)}}`);
      }
      if ((dsl as any).confirmText) {
        props.push(`confirmText="${String((dsl as any).confirmText).replace(/"/g, '&quot;')}"`);
      }
      if ((dsl as any).cancelText) {
        props.push(`cancelText="${String((dsl as any).cancelText).replace(/"/g, '&quot;')}"`);
      }
      if ((dsl as any).actionContractId) {
        props.push(`actionContractId="${String((dsl as any).actionContractId)}"`);
      }
      break;
  }

  return props.length > 0 ? ` ${props.join(' ')}` : '';
}


/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

