/**
 * Layout generators
 */

import type { UiPage, UiLayout } from "../../types";
import type { GeneratorOptions } from "../../generator";
import { toPascalCase } from "../../utils/common";
import { generateGenericSection } from "../sections/section-generators";
import { generateSimpleComponentJSX } from "../sections/component-generator";
import { generateTSX } from "../../generator-core";

/**
 * Generate dashboard layout page
 */
export function generateDashboardLayout(
  dsl: UiPage,
  layout: Extract<UiLayout, { type: 'dashboard' }>,
  options: GeneratorOptions
): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  
  const cols = layout.grid?.cols || 12;
  const gap = layout.grid?.gap || 4;
  
  const headerSections = dsl.sections?.filter(s => s.kind === 'header') || [];
  const sidebarSections = dsl.sections?.filter(s => s.kind === 'sidebar') || [];
  const contentSections = dsl.sections?.filter(s => s.kind === 'content') || [];
  
  const headerContent = headerSections.length > 0
    ? headerSections.map(s => generateGenericSection(s, dsl as any)).join('\n')
    : '<div>Header</div>';
  
  const sidebarContent = sidebarSections.length > 0
    ? sidebarSections.map(s => generateGenericSection(s, dsl as any)).join('\n')
    : '<div>Sidebar</div>';
  
  const mainContent = contentSections.length > 0
    ? contentSections.map(s => generateGenericSection(s, dsl as any)).join('\n')
    : '<div>Content</div>';
  
  const gridTemplateAreas = layout.areas.map(area => `"${area}"`).join(' ');
  const gridTemplateColumns = `repeat(${cols}, 1fr)`;
  
  if (options.includeImports) {
    if (importsFromUI.length > 0) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    }
    imports.push('import * as React from "react";');
  }
  
  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedDashboard';
  
  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div 
      className="h-screen grid" 
      style={{ 
        gridTemplateColumns: "${gridTemplateColumns}", 
        gridTemplateAreas: "${gridTemplateAreas}",
        gap: "${gap}px" 
      }}
      data-ui-id="${dsl.id}"
    >
      ${layout.areas.includes('header') ? `<header className="p-4 border-b" data-ui-id="${dsl.id}-header">
        ${headerContent}
      </header>` : ''}
      ${layout.areas.includes('sidebar') ? `<aside className="p-4 border-r" data-ui-id="${dsl.id}-sidebar">
        ${sidebarContent}
      </aside>` : ''}
      ${layout.areas.includes('content') ? `<main className="p-4 overflow-auto" data-ui-id="${dsl.id}-content">
        ${mainContent}
      </main>` : ''}
    </div>
  );
}
`;
}

/**
 * Generate marketing layout page
 */
export function generateMarketingLayout(
  dsl: UiPage,
  layout: Extract<UiLayout, { type: 'marketing' }>,
  options: GeneratorOptions
): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  const importsFromBlocks: string[] = [];
  
  const sections: string[] = [];
  
  const sectionMap: Record<string, { component: string; fromBlocks: boolean }> = {
    features: { component: 'FeaturesBlock', fromBlocks: false },
    proof: { component: 'TestimonialsBlock', fromBlocks: false },
    pricing: { component: 'PricingTable', fromBlocks: true },
    faq: { component: 'FAQBlock', fromBlocks: false },
    cta: { component: 'CTABlock', fromBlocks: false },
  };
  
  if (layout.hero) {
    sections.push(`        <section className="py-20 text-center" data-ui-id="${dsl.id}-hero">
          <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
          <p className="text-xl text-muted-foreground mb-8">Welcome to our product</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md">Get Started</button>
        </section>`);
  }
  
  for (const sectionType of layout.sections) {
    const mapping = sectionMap[sectionType];
    if (mapping) {
      if (mapping.fromBlocks) {
        if (sectionType === 'pricing') {
          sections.push(`        <section className="py-16" data-ui-id="${dsl.id}-${sectionType}">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
            <p className="text-center text-muted-foreground">Pricing section - PricingTable component requires tiers data</p>
          </div>
        </section>`);
        } else {
          if (!importsFromBlocks.includes(mapping.component)) {
            importsFromBlocks.push(mapping.component);
          }
          sections.push(`        <${mapping.component} data-ui-id="${dsl.id}-${sectionType}" />`);
        }
      } else {
        sections.push(`        <section className="py-16" data-ui-id="${dsl.id}-${sectionType}">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}</h2>
            <p className="text-center text-muted-foreground">${sectionType} section content</p>
          </div>
        </section>`);
      }
    }
  }
  
  if (options.includeImports) {
    if (importsFromUI.length > 0) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    }
    if (importsFromBlocks.length > 0) {
      imports.push(`import { ${importsFromBlocks.join(', ')} } from "@fragment_ui/blocks";`);
    }
    imports.push('import * as React from "react";');
  }
  
  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedMarketing';
  
  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="min-h-screen" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="sr-only">${dsl.title}</h1>` : ''}
${sections.join('\n')}
    </div>
  );
}
`;
}

/**
 * Generate two-column layout page
 */
export function generateTwoColumnLayout(
  dsl: UiPage,
  layout: Extract<UiLayout, { type: 'two-column' }>,
  options: GeneratorOptions
): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  
  const ratio = layout.ratio || '1:1';
  const [col1, col2] = ratio.split(':').map(Number);
  const gridCols = `grid-cols-1 md:grid-cols-[${col1}fr_${col2}fr]`;
  
  const sections = dsl.sections || [];
  const midPoint = Math.ceil(sections.length / 2);
  const leftSections = sections.slice(0, midPoint);
  const rightSections = sections.slice(midPoint);
  
  const leftContent = leftSections.map(s => generateGenericSection(s, dsl as any)).join('\n');
  const rightContent = rightSections.map(s => generateGenericSection(s, dsl as any)).join('\n');
  
  if (options.includeImports) {
    if (importsFromUI.length > 0) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    }
    imports.push('import * as React from "react";');
  }
  
  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedTwoColumn';
  
  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="max-w-7xl mx-auto p-6" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="text-3xl font-bold mb-8" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
      <div className="grid ${gridCols} gap-6">
        <div data-ui-id="${dsl.id}-left">
          ${leftContent}
        </div>
        <div data-ui-id="${dsl.id}-right">
          ${rightContent}
        </div>
      </div>
    </div>
  );
}
`;
}

/**
 * Generate Grid Layout
 */
export function generateGridLayout(dsl: UiPage, layout: Extract<UiLayout, { type: 'grid' }>, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  const importsFromBlocks: string[] = [];
  const sections: string[] = [];

  if (dsl.sections) {
    for (const section of dsl.sections) {
      let content: string;
      
      if (Array.isArray(section.content)) {
        content = section.content.map(c => {
          if (c && typeof c === 'object' && 'type' in c && !('sections' in c) && !('fields' in c)) {
            return generateSimpleComponentJSX(c, dsl as any);
          } else {
            return generateTSX(c, { includeImports: false });
          }
        }).join('\n');
      } else {
        content = 'Content';
      }

      sections.push(`      <div data-ui-id="${section.id}">
        ${content}
      </div>`);
    }
  }

  if (options.includeImports) {
    if (importsFromUI.length > 0) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    }
    if (importsFromBlocks.length > 0) {
      imports.push(`import { ${importsFromBlocks.join(', ')} } from "@fragment_ui/blocks";`);
    }
    imports.push('import * as React from "react";');
  }

  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedPage';

  const maxWidthClass = layout.maxWidth ? `max-w-${layout.maxWidth}` : 'max-w-7xl';
  const gapClass = `gap-${layout.gap || 4}`;

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${maxWidthClass} mx-auto p-6" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="text-3xl font-bold mb-8" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
      <div className="grid grid-cols-${layout.columns || 1} ${gapClass}">
${sections.join('\n')}
      </div>
    </div>
  );
}
`;
}

/**
 * Generate Stack Layout
 */
export function generateStackLayout(dsl: UiPage, layout: Extract<UiLayout, { type: 'stack' }>, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  const importsFromBlocks: string[] = [];
  const sections: string[] = [];

  if (dsl.sections) {
    for (const section of dsl.sections) {
      let content: string;
      
      if (Array.isArray(section.content)) {
        content = section.content.map(c => {
          if (c && typeof c === 'object' && 'type' in c && !('sections' in c) && !('fields' in c)) {
            return generateSimpleComponentJSX(c, dsl as any);
          } else {
            return generateTSX(c, { includeImports: false });
          }
        }).join('\n');
      } else {
        content = 'Content';
      }

      sections.push(`      <div data-ui-id="${section.id}">
        ${content}
      </div>`);
    }
  }

  if (options.includeImports) {
    if (importsFromUI.length > 0) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    }
    if (importsFromBlocks.length > 0) {
      imports.push(`import { ${importsFromBlocks.join(', ')} } from "@fragment_ui/blocks";`);
    }
    imports.push('import * as React from "react";');
  }

  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedPage';

  const maxWidthClass = layout.maxWidth ? `max-w-${layout.maxWidth}` : 'max-w-7xl';
  const gapClass = `space-y-${layout.gap || 4}`;

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${maxWidthClass} mx-auto p-6" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="text-3xl font-bold mb-8" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
      <div className="${gapClass}">
${sections.join('\n')}
      </div>
    </div>
  );
}
`;
}

