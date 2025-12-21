#!/usr/bin/env node

/**
 * Script to update block descriptions according to the provided list
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const COMPONENTS_DIR = 'apps/www/app/docs/components';
const BLOCKS_DIR = 'apps/www/app/docs/blocks';

const DESCRIPTIONS = {
  'activity-feed': 'A ready-made activity feed section.',
  'analytics-dashboard': 'A full dashboard page for key metrics.',
  'app-shell': 'Standard layout: nav + header + content.',
  'authentication-block': 'Login/signup UI ready to drop in.',
  'benefits-section': 'Highlight product benefits in a structured layout.',
  'card-grid': 'Display content cards in a responsive grid.',
  'comparison-section': 'Compare plans or features side-by-side.',
  'cta-section': 'Drive a primary action with focused messaging.',
  'dashboard-layout': 'A dashboard-ready page structure and spacing.',
  'dashboard-widgets': 'A set of reusable dashboard panels/widgets.',
  'data-table': 'A complete table setup for data-heavy screens.',
  'data-table-toolbar': 'Search, filters, columns, and actions for tables.',
  'empty-state': 'Friendly placeholder when there\'s no data.',
  'faq-section': 'Expandable questions and answers for support content.',
  'feature-grid-section': 'A grid layout to showcase features.',
  'filter-bar': 'A ready filter header for lists/tables.',
  'footer-section': 'A standard site footer with links and info.',
  'form-container': 'Structured layout for forms with actions.',
  'hero-section': 'Top-of-page headline, value prop, and CTA.',
  'kpi-dashboard': 'Dashboard template focused on KPIs and trends.',
  'kpi-strip': 'Horizontal row of KPI cards.',
  'metric-card': 'A reusable metric card for dashboards.',
  'navigation-header': 'A top navigation header for the app.',
  'pagination-footer': 'Pagination controls placed at the bottom.',
  'pricing-table': 'Plan cards/table with pricing and features.',
  'quick-actions': 'Shortcut actions block for common tasks.',
  'settings-screen': 'Template for account/app settings pages.',
  'stats-section': 'Section that highlights key stats and numbers.',
  'testimonials-section': 'Quotes and social proof section layout.',
  'widget-container': 'A consistent wrapper for dashboard widgets.',
};

function updateDescription(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Extract component name from path
  const pathParts = filePath.split('/');
  const componentName = pathParts[pathParts.length - 2]; // e.g., "button" from "button/page.tsx"
  
  // Get description for this component
  const description = DESCRIPTIONS[componentName];
  
  if (!description) {
    return false; // Component not in list, skip
  }
  
  // Find and replace intro-text paragraph
  // Match: <p className="mb-6 intro-text">...existing text...</p>
  const introTextRegex = /<p className="mb-6 intro-text">[\s\S]*?<\/p>/;
  const match = content.match(introTextRegex);
  
  if (match) {
    const newIntroText = `<p className="mb-6 intro-text">\n        ${description}\n      </p>`;
    content = content.replace(introTextRegex, newIntroText);
  } else {
    // If intro-text not found, try to find any paragraph after h1
    const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/);
    if (h1Match) {
      const afterH1 = content.substring(h1Match.index + h1Match[0].length);
      const firstPMatch = afterH1.match(/<p[^>]*>[\s\S]*?<\/p>/);
      if (firstPMatch) {
        const pStart = h1Match.index + h1Match[0].length + firstPMatch.index;
        const pEnd = pStart + firstPMatch[0].length;
        const newIntroText = `\n      <p className="mb-6 intro-text">\n        ${description}\n      </p>`;
        content = content.slice(0, pStart) + newIntroText + content.slice(pEnd);
      }
    }
  }
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${componentName}`);
    return true;
  }
  return false;
}

async function main() {
  const componentFiles = await glob(`${COMPONENTS_DIR}/*/page.tsx`);
  const blockFiles = await glob(`${BLOCKS_DIR}/*/page.tsx`);
  const allFiles = [...componentFiles, ...blockFiles];

  console.log(`Updating descriptions for ${allFiles.length} block pages...\n`);

  let updated = 0;
  for (const file of allFiles) {
    if (await updateDescription(file)) {
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} block descriptions.`);
}

main().catch(console.error);

