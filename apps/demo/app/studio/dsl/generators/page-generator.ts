/**
 * Page generator - generates React page components from UI-DSL
 */

import type { UiPage, UiCommon, UiModule, UiScreenRegion, UiLayout } from '../types';
import type { GeneratorOptions } from '../generator';
import { toPascalCase } from '../utils/common';
import { generateModule } from './modules';
import {
  generateDashboardLayout,
  generateMarketingLayout,
  generateTwoColumnLayout,
  generateGridLayout,
  generateStackLayout,
} from './layouts';
import {
  generateCardSection,
  generateTabsSection,
  generateTwoColumnSection,
  generateGenericSection,
  generateSimpleComponentJSX,
} from './sections';
import { generateGenericSection as generateGenericSectionFn } from './sections/section-generators';
import { getRegionClassName } from '../utils/screen-utils';
import { generateTSX } from '../generator-core';

/**
 * Generate page component
 */
export function generatePage(dsl: UiPage, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = [];
  const importsFromBlocks: string[] = [];

  // Milestone 3.1: Check if this is a screen with regions
  if (dsl.regions) {
    return generateScreenWithRegions(dsl, options);
  }

  // Check if layout is specified
  if (dsl.layout && typeof dsl.layout === 'object' && 'type' in dsl.layout) {
    const layout = dsl.layout as UiLayout;
    
    if (layout.type === 'dashboard') {
      return generateDashboardLayout(dsl, layout, options);
    } else if (layout.type === 'marketing') {
      return generateMarketingLayout(dsl, layout, options);
    } else if (layout.type === 'two-column') {
      return generateTwoColumnLayout(dsl, layout, options);
    } else if (layout.type === 'grid') {
      return generateGridLayout(dsl, layout, options);
    } else if (layout.type === 'stack') {
      return generateStackLayout(dsl, layout, options);
    }
  }

  // Check if this is a simple single-component page (e.g., just one button)
  // If so, generate simpler code structure without wrappers
  const isSimpleComponentPage = dsl.sections && 
    dsl.sections.length === 1 && 
    dsl.sections[0].content && 
    Array.isArray(dsl.sections[0].content) && 
    dsl.sections[0].content.length === 1 &&
    dsl.sections[0].content[0] && 
    typeof dsl.sections[0].content[0] === 'object' && 
    'type' in dsl.sections[0].content[0] && 
    !('sections' in dsl.sections[0].content[0]) && 
    !('fields' in dsl.sections[0].content[0]);

  if (isSimpleComponentPage && dsl.sections && Array.isArray(dsl.sections) && 
      Array.isArray(dsl.sections[0].content)) {
    // Generate simple component without wrappers
    const simpleComponent = dsl.sections[0].content[0];
    const componentJSX = generateSimpleComponentJSX(simpleComponent, dsl as any);
    
    // Collect imports
    if ('component' in simpleComponent && simpleComponent.component === 'Button') {
      importsFromUI.push('Button');
    } else if ('component' in simpleComponent && simpleComponent.component === 'Input') {
      importsFromUI.push('Input');
    }
    
    // Use original component name if available, otherwise use title or default
    const componentName = dsl.name || dsl.title 
      ? toPascalCase((dsl.name || dsl.title || '').replace(/[^a-zA-Z0-9]/g, ' '))
      : 'GeneratedComponent';
    
    // Build imports
    if (options.includeImports) {
      if (importsFromUI.length > 0) {
        imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
      }
      imports.push('import * as React from "react";');
    }
    
    return `${imports.join('\n')}

export default function ${componentName}() {
  return ${componentJSX};
}
`;
  }

  // Default page generation (no specific layout)
  const sections: string[] = [];

  // Collect components used in sections (for imports)
  const collectSectionComponents = (section: NonNullable<UiPage['sections']>[0]) => {
    if (Array.isArray(section.content)) {
      section.content.forEach(c => {
        // Check if it's a simple component
        if (c && typeof c === 'object' && 'component' in c && !('sections' in c) && !('fields' in c)) {
          if ('component' in c && c.component === 'Button') {
            if (!importsFromUI.includes('Button')) {
              importsFromUI.push('Button');
            }
          } else if ('component' in c && c.component === 'Input') {
            if (!importsFromUI.includes('Input')) {
              importsFromUI.push('Input');
            }
          }
        }
      });
    }
  };

  // Process sections
  if (dsl.sections) {
    for (const section of dsl.sections) {
      // Collect components used in this section
      collectSectionComponents(section);
      
      // Milestone 3.1: Check if section uses a module
      if (section.module) {
      const module: UiModule = {
        id: section.id,
        type: section.module,
        title: section.title,
        props: section.moduleProps || {},
      };
      const moduleResult = generateModule(module, dsl as any, options);
      sections.push(moduleResult.jsx);
      // Collect imports from module
      moduleResult.imports.forEach(imp => {
        if (!importsFromUI.includes(imp)) {
          importsFromUI.push(imp);
        }
      });
      if (!importsFromUI.includes('Card')) {
        importsFromUI.push('Card', 'CardHeader', 'CardTitle', 'CardContent');
      }
      continue;
    }
    
    switch (section.kind) {
      case 'card':
        if (!importsFromUI.includes('Card')) {
          importsFromUI.push('Card', 'CardHeader', 'CardTitle', 'CardContent');
        }
        sections.push(generateCardSection(section, dsl as any));
        break;
      case 'tabs':
        if (!importsFromUI.includes('Tabs')) {
          importsFromUI.push('Tabs', 'TabsList', 'TabsTrigger', 'TabsContent');
        }
        sections.push(generateTabsSection(section));
        break;
      case 'two-column':
        sections.push(generateTwoColumnSection(section, dsl as any));
        break;
      default:
        // Generic section
        sections.push(generateGenericSection(section, dsl as any));
        break;
    }
    }
  }

  // Build imports
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

  const layoutClass = dsl.layout && typeof dsl.layout === 'object' && 'maxWidth' in dsl.layout
    ? `max-w-${(dsl.layout as any).maxWidth}` 
    : 'max-w-7xl';

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${layoutClass} mx-auto p-6 space-y-6" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="text-3xl font-bold mb-8" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
${sections.map(s => `      ${s}`).join('\n')}
    </div>
  );
}
`;
}

/**
 * Milestone 3.1: Generate screen with regions (header, sidebar, content, footer)
 */
function generateScreenWithRegions(dsl: UiPage, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = ['Button', 'Card', 'CardHeader', 'CardTitle', 'CardContent'];
  const importsFromBlocks: string[] = [];
  
  if (!dsl.regions) {
    throw new Error('Screen DSL requires regions');
  }

  const regions: string[] = [];
  const regionOrder: UiScreenRegion[] = ['header', 'sidebar', 'content', 'footer', 'main'];

  // Process each region
  for (const regionName of regionOrder) {
    const region = dsl.regions[regionName];
    if (!region) continue;

    let regionContent: string[] = [];

    // Process modules in this region
    if (region.modules) {
      for (const module of region.modules) {
        const moduleResult = generateModule(module, dsl as any, options);
        regionContent.push(moduleResult.jsx);
        
        // Collect imports from module
        moduleResult.imports.forEach(imp => {
          if (!importsFromUI.includes(imp)) {
            importsFromUI.push(imp);
          }
        });
      }
    }

    // Process direct content in this region
    if (region.content) {
      for (const contentItem of region.content) {
        // contentItem is UiDsl, which can be form, page, screen, table, dashboard, or decision
        // If it's a page/screen with sections, we might want to handle it differently
        // But for now, just generate TSX for all content items
        const contentJSX = generateTSX(contentItem, { includeImports: false });
        regionContent.push(contentJSX);
      }
    }

    if (regionContent.length > 0) {
      // Map region names to HTML tags
      // 'content' and 'main' both map to <main>
      const regionTag = (regionName === 'main' || regionName === 'content') ? 'main' : regionName;
      
      // Get layout parameters for grid system
      const layout = dsl.layout && typeof dsl.layout === 'object' && 'type' in dsl.layout 
        ? dsl.layout as UiLayout 
        : null;
      const gap = layout && 'gap' in layout ? layout.gap : 6;
      const gridColumns = layout && 'columns' in layout ? layout.columns : 12;
      
      // For content region, wrap content in grid container for consistent spacing
      let regionHTML = '';
      if (regionName === 'content' || regionName === 'main') {
        // Map gap number to Tailwind class (4, 6, 8 are common)
        const gapClass = gap === 4 ? 'gap-4' : gap === 6 ? 'gap-6' : gap === 8 ? 'gap-8' : `gap-[${gap}px]`;
        const paddingClass = gap === 4 ? 'p-4' : gap === 6 ? 'p-6' : gap === 8 ? 'p-8' : `p-[${gap}px]`;
        
        regionHTML = `      <${regionTag} className="${getRegionClassName(regionName)}" data-ui-id="${region.id}">
        <div className="grid grid-cols-1 md:grid-cols-12 ${gapClass} ${paddingClass}">
${regionContent.map(c => `          ${c}`).join('\n')}
        </div>
      </${regionTag}>`;
      } else {
        regionHTML = `      <${regionTag} className="${getRegionClassName(regionName)}" data-ui-id="${region.id}">
${regionContent.map(c => `        ${c}`).join('\n')}
      </${regionTag}>`;
      }
      
      regions.push(regionHTML);
    }
  }

  // Build imports
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
    : 'GeneratedScreen';

  // Get layout parameters for grid system
  const layout = dsl.layout && typeof dsl.layout === 'object' && 'type' in dsl.layout 
    ? dsl.layout as UiLayout 
    : null;
  
  const maxWidth = layout && 'maxWidth' in layout 
    ? layout.maxWidth 
    : 'full';
  const gap = layout && 'gap' in layout 
    ? layout.gap 
    : 6;
  const gridColumns = layout && 'columns' in layout 
    ? layout.columns 
    : 12;
  
  const layoutClass = maxWidth !== 'full' ? `max-w-${maxWidth}` : '';
  const containerClass = layoutClass ? `${layoutClass} mx-auto` : 'w-full';
  
  // Regions are already processed with grid containers, no need to process again
  const processedRegions = regions;

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${containerClass} min-h-screen" data-ui-id="${dsl.id}">
${processedRegions.join('\n')}
    </div>
  );
}
`;
}

