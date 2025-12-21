/**
 * Section generators
 */

import type { UiPage, UiCommon } from "../../types";
import { generateTSX } from "../../generator-core";
import { generateSimpleComponentJSX } from "./component-generator";

/**
 * Generate ACL attributes for section (data-intent, data-section-role)
 */
export function sectionAclAttrs(section: NonNullable<UiPage['sections']>[0], dsl?: UiCommon): string[] {
  const attrs: string[] = [];
  
  // Add data-section-role from section.kind
  if (section.kind) {
    const roleMap: Record<string, string> = {
      'content': 'details',
      'card': 'details',
      'tabs': 'options',
      'two-column': 'options',
      'form': 'form',
      'summary': 'summary',
      'checkout': 'checkout',
      'confirmation': 'confirmation',
    };
    
    const role = roleMap[section.kind] || section.kind;
    attrs.push(`data-section-role="${role}"`);
  }
  
  // Add data-intent from DSL intent
  if (dsl?.intent?.primary) {
    attrs.push(`data-intent="${dsl.intent.primary}"`);
  } else if (section.kind) {
    const intentMap: Record<string, string> = {
      'form': 'collect-input',
      'card': 'display-content',
      'tabs': 'navigate-options',
      'two-column': 'compare-options',
      'summary': 'review-summary',
      'checkout': 'complete-purchase',
      'confirmation': 'confirm-action',
    };
    
    const autoIntent = intentMap[section.kind];
    if (autoIntent) {
      attrs.push(`data-intent="${autoIntent}"`);
    }
  }
  
  return attrs;
}

/**
 * Generate card section
 */
export function generateCardSection(section: NonNullable<UiPage['sections']>[0], dsl?: UiCommon): string {
  const title = section.title || 'Section';
  let content: string;
  
  if (Array.isArray(section.content)) {
    content = section.content.map(c => {
      if (c && typeof c === 'object' && 'type' in c && !('sections' in c) && !('fields' in c)) {
        return generateSimpleComponentJSX(c, dsl);
      } else {
        return generateTSX(c, { includeImports: false });
      }
    }).join('\n');
  } else {
    content = 'Content';
  }

  const aclAttrs = sectionAclAttrs(section, dsl);
  const aclAttrsStr = aclAttrs.length > 0 ? ` ${aclAttrs.join(' ')}` : '';

  return `<Card data-ui-id="${section.id}"${aclAttrsStr}>
        <CardHeader>
          <CardTitle>${title}</CardTitle>
        </CardHeader>
        <CardContent>
          ${content}
        </CardContent>
      </Card>`;
}

/**
 * Generate tabs section
 */
export function generateTabsSection(section: NonNullable<UiPage['sections']>[0]): string {
  if (!Array.isArray(section.content) && typeof section.content === 'object') {
    const tabs = Object.entries(section.content).map(([key, content]) => {
      const tabContent = Array.isArray(content) 
        ? content.map(c => generateTSX(c, { includeImports: false })).join('\n')
        : 'Content';
      return `        <TabsContent value="${key}">
          ${tabContent}
        </TabsContent>`;
    });

    const triggers = Object.keys(section.content).map(key => 
      `        <TabsTrigger value="${key}">${key}</TabsTrigger>`
    );

    return `<Tabs defaultValue="${Object.keys(section.content)[0]}" className="w-full">
        <TabsList>
${triggers.join('\n')}
        </TabsList>
${tabs.join('\n')}
      </Tabs>`;
  }

  return `<Tabs defaultValue="tab1" className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          Content
        </TabsContent>
      </Tabs>`;
}

/**
 * Generate two-column section
 */
export function generateTwoColumnSection(section: NonNullable<UiPage['sections']>[0], dsl?: UiCommon): string {
  let content: string;
  
  if (Array.isArray(section.content)) {
    content = section.content.map(c => {
      if (c && typeof c === 'object' && 'type' in c && !('sections' in c) && !('fields' in c)) {
        return generateSimpleComponentJSX(c, dsl);
      } else {
        return generateTSX(c, { includeImports: false });
      }
    }).join('\n');
  } else {
    content = 'Content';
  }

  const aclAttrs = sectionAclAttrs(section, dsl);
  const aclAttrsStr = aclAttrs.length > 0 ? ` ${aclAttrs.join(' ')}` : '';

  return `<div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-ui-id="${section.id}"${aclAttrsStr}>
        <div>${content}</div>
        <div>${content}</div>
      </div>`;
}

/**
 * Generate generic section
 */
export function generateGenericSection(section: NonNullable<UiPage['sections']>[0], dsl?: UiCommon): string {
  let content: string;
  
  if (Array.isArray(section.content)) {
    content = section.content.map(c => {
      if (c && typeof c === 'object' && 'type' in c && !('sections' in c) && !('fields' in c)) {
        return generateSimpleComponentJSX(c, dsl);
      } else {
        return generateTSX(c, { includeImports: false });
      }
    }).join('\n');
  } else {
    content = 'Content';
  }

  const aclAttrs = sectionAclAttrs(section, dsl);
  const aclAttrsStr = aclAttrs.length > 0 ? ` ${aclAttrs.join(' ')}` : '';

  const title = section.title ? `<h2 className="text-2xl font-bold mb-4" data-ui-id="${section.id}-title">${section.title}</h2>` : '';

  // Get col-span from section (if it has layout property) or default to full width (12 columns)
  // Note: sections in UiPage don't have layout property, but we check for it for backward compatibility
  const colSpan = (section as any).layout?.colSpan || 12;
  
  // Map colSpan to Tailwind classes (only support common values for proper Tailwind compilation)
  let colSpanClass = 'col-span-12'; // Default full width
  if (colSpan === 12) {
    colSpanClass = 'col-span-12';
  } else if (colSpan === 6) {
    colSpanClass = 'col-span-12 md:col-span-6';
  } else if (colSpan === 4) {
    colSpanClass = 'col-span-12 md:col-span-4';
  } else if (colSpan === 3) {
    colSpanClass = 'col-span-12 md:col-span-3';
  } else if (colSpan === 8) {
    colSpanClass = 'col-span-12 md:col-span-8';
  } else if (colSpan === 9) {
    colSpanClass = 'col-span-12 md:col-span-9';
  } else {
    // For other values, use arbitrary value (may not work in all Tailwind configs)
    colSpanClass = `col-span-12 md:col-span-[${colSpan}]`;
  }

  return `<section className="${colSpanClass}" data-ui-id="${section.id}"${aclAttrsStr}>
      ${title}
      ${content}
    </section>`;
}

