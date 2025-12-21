#!/usr/bin/env node

/**
 * Script to update component descriptions according to the provided list
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const COMPONENTS_DIR = 'apps/www/app/docs/components';

const DESCRIPTIONS = {
  'badge': 'Display a small status or label.',
  'breadcrumbs': 'Show location within a navigation hierarchy.',
  'button': 'Trigger an action when clicked or tapped.',
  'calendar': 'Pick dates visually from a calendar view.',
  'card': 'Group related content in a container.',
  'carousel': 'Browse items one at a time by sliding.',
  'chart': 'Visualize data using common chart types.',
  'checkbox': 'Toggle a boolean option on or off.',
  'collapsible': 'Expand or collapse a content area.',
  'color-picker': 'Choose a color value interactively.',
  'combobox': 'Search and select from a dropdown list.',
  'command-palette': 'Search and run actions via keyboard.',
  'date-picker': 'Select a date (or range) quickly.',
  'dialog': 'Show a modal window for focused tasks.',
  'file-upload': 'Select and upload files to the app.',
  'filter-bar': 'Apply filters to refine a list.',
  'input': 'Enter a single-line text value.',
  'kbd': 'Display keyboard shortcuts in UI.',
  'menubar': 'Access grouped commands from a top menu.',
  'metric-card': 'Show a key number with context.',
  'multi-select': 'Choose multiple options from a list.',
  'pagination': 'Navigate through pages of results.',
  'popover': 'Show contextual content anchored to an element.',
  'progress': 'Indicate completion of a task or process.',
  'quick-actions': 'Provide one-click shortcuts to common tasks.',
  'radio': 'Select one option from a set.',
  'rating': 'Capture a score (e.g., stars) from users.',
  'resizable': 'Resize panels by dragging a handle.',
  'segmented-control': 'Switch between a few related views.',
  'select': 'Choose one option from a dropdown list.',
  'separator': 'Visually divide content into sections.',
  'sheet': 'Slide-in panel for secondary workflows.',
  'skeleton': 'Placeholder while content is loading.',
  'slider': 'Pick a value from a continuous range.',
  'spinner': 'Indicate loading in progress.',
  'split-button': 'Main action plus a dropdown of alternatives.',
  'stepper': 'Guide users through multi-step flows.',
  'switch': 'Toggle a setting on or off.',
  'table': 'Display structured data in rows and columns.',
  'tabs': 'Switch between related panels of content.',
  'tag-input': 'Add and remove multiple labeled tags.',
  'textarea': 'Enter multi-line text content.',
  'timeline': 'Show events along a time sequence.',
  'toast': 'Show a brief, non-blocking message.',
  'toggle': 'Turn a single feature on or off.',
  'toggle-group': 'Toggle between multiple related options.',
  'tooltip': 'Show a short hint on hover/focus.',
  'tree-view': 'Browse nested items in a hierarchy.',
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

  console.log(`Updating descriptions for ${componentFiles.length} component pages...\n`);

  let updated = 0;
  for (const file of componentFiles) {
    if (await updateDescription(file)) {
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} component descriptions.`);
}

main().catch(console.error);

