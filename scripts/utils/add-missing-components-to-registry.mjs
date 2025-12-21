#!/usr/bin/env node

/**
 * Script to add missing components from apps/www to registry.json
 * 
 * This script compares components listed in apps/www with those in registry.json
 * and adds basic entries for missing components.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Components from apps/www
const wwwComponents = [
  "accordion", "alert", "aspect-ratio", "avatar", "badge", "breadcrumbs", "button",
  "calendar", "card", "carousel", "chart", "checkbox", "collapsible", "color-picker", "combobox",
  "command-palette", "context-menu", "data-table", "date-picker", "dialog", "dropdown-menu",
  "file-upload", "form-container", "form-field", "hover-card", "input", "kbd", "menubar",
  "metric-card", "multi-select", "navigation-menu", "pagination", "popover", "progress", "radio", "rating",
  "resizable", "scroll-area", "segmented-control", "select", "separator", "sheet", "skeleton",
  "slider", "spinner", "split-button", "stepper", "switch", "table", "tabs", "tag-input",
  "textarea", "timeline", "toast", "toggle", "toggle-group", "tooltip", "tree-view",
  "activity-feed", "quick-actions", "filter-bar",
];

// Blocks from apps/www
const wwwBlocks = [
  "authentication-block", "card-grid", "dashboard-layout", "form-container",
  "navigation-header", "pricing-table", "settings-screen",
  "hero-section", "feature-grid-section", "stats-section", "testimonials-section", "faq-section", "cta-section",
  "widget-container", "dashboard-widgets",
  "benefits-section", "comparison-section", "footer-section",
  "kpi-dashboard", "analytics-dashboard",
];

// Read registry
const registryPath = join(rootDir, 'packages/registry/registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));

// Helper to convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Get existing component names (normalized to lowercase)
const existingComponents = new Set(
  Object.keys(registry.components || {}).map(c => c.toLowerCase())
);

// Find missing components
const allItems = [...wwwComponents, ...wwwBlocks];
const missing = allItems.filter(item => {
  const normalized = item.toLowerCase();
  const pascal = toPascalCase(item);
  return !existingComponents.has(normalized) && 
         !existingComponents.has(pascal.toLowerCase()) &&
         !registry.components[pascal];
});

console.log(`Found ${missing.length} missing components/blocks:`);
console.log(missing.join(', '));

// Add missing components with basic structure
let added = 0;
for (const name of missing) {
  const pascalName = toPascalCase(name);
  const isBlock = name.includes('-') && !['multi-select', 'command-palette', 'date-picker', 'toggle-group', 'tree-view', 'color-picker', 'segmented-control', 'rating', 'file-upload', 'split-button', 'tag-input', 'activity-feed', 'quick-actions', 'filter-bar', 'notification-list', 'metric-card', 'dropdown-menu', 'context-menu', 'hover-card', 'navigation-menu', 'scroll-area', 'aspect-ratio', 'data-table', 'form-field'].includes(name);
  const packageName = isBlock ? "@fragment_ui/blocks" : "@fragment_ui/ui";
  
  registry.components[pascalName] = {
    import: `${packageName}/${name}`,
    props: {},
    variants: [],
    slots: [],
    a11y: {
      role: "region",
      notes: `${pascalName} component`
    },
    note: `Component ${pascalName} from ${packageName}`
  };
  
  added++;
  console.log(`Added: ${pascalName} (${packageName})`);
}

if (added > 0) {
  // Write updated registry
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
  console.log(`\n✅ Added ${added} components to registry.json`);
} else {
  console.log('\n✅ No missing components found');
}

