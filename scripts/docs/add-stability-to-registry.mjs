#!/usr/bin/env node

/**
 * Script to add stability levels to all components in registry.json
 * 
 * Usage: node scripts/add-stability-to-registry.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const registryPath = join(__dirname, '../packages/registry/registry.json');

// Components that should be marked as "stable" (core, well-tested components)
const STABLE_COMPONENTS = [
  'Button',
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'Card',
  'Dialog',
  'Sheet',
  'Popover',
  'Tooltip',
  'DropdownMenu',
  'ContextMenu',
  'Tabs',
  'Accordion',
  'Separator',
  'Badge',
  'Avatar',
  'Progress',
  'Spinner',
  'Skeleton',
  'Table',
  'Pagination',
  'Breadcrumbs',
  'Alert',
  'Toast',
  'FormField',
  'Form',
  'FormFieldEnhanced',
  'FormEnhanced',
  'Calendar',
  'DatePicker',
  'Slider',
  'Toggle',
  'ToggleGroup',
  'Collapsible',
  'ScrollArea',
  'AspectRatio',
  'Resizable',
  'Carousel',
  'NavigationMenu',
  'Menubar',
  'CommandPalette',
  'Combobox',
  'MultiSelect',
  'TagInput',
  'FileUpload',
  'ColorPicker',
  'Rating',
  'SplitButton',
  'Stepper',
  'Timeline',
  'TreeView',
  'Kbd',
  'HoverCard',
];

// Components that should be marked as "experimental" (newer, may change)
const EXPERIMENTAL_COMPONENTS = [
  'PasswordInput',
  'SegmentedControl',
  'ActivityFeed',
  'QuickActions',
  'FilterBar',
  'MetricCard',
  'Chart',
  'ImageOptimization',
  'VirtualScrolling',
  'VoiceChatPanel',
];

// Blocks - most should be stable, some experimental
const STABLE_BLOCKS = [
  'DashboardLayout',
  'KPIDashboard',
  'AnalyticsDashboard',
  'DataTable',
  'CardGrid',
  'FormContainer',
  'NavigationHeader',
  'SettingsScreen',
  'PricingTable',
  'AuthenticationBlock',
  'WidgetContainer',
  'DashboardWidgets',
  'HeroSection',
  'FeatureGridSection',
  'StatsSection',
  'TestimonialsSection',
  'FAQSection',
  'CTASection',
  'BenefitsSection',
  'ComparisonSection',
  'FooterSection',
];

const EXPERIMENTAL_BLOCKS = [
  'DecisionCompare3',
  'DecisionRecommendation',
  'DecisionReviewConfirm',
  'DecisionTradeoffs',
];

// Read registry
console.log('📖 Reading registry...');
const registryContent = readFileSync(registryPath, 'utf-8');
const registry = JSON.parse(registryContent);

let updated = 0;
let skipped = 0;

// Process each component
for (const [componentName, componentInfo] of Object.entries(registry.components)) {
  // Skip if already has stability
  if (componentInfo.stability) {
    skipped++;
    continue;
  }

  // Determine stability level
  let stability = 'stable'; // default

  if (STABLE_COMPONENTS.includes(componentName) || STABLE_BLOCKS.includes(componentName)) {
    stability = 'stable';
  } else if (EXPERIMENTAL_COMPONENTS.includes(componentName) || EXPERIMENTAL_BLOCKS.includes(componentName)) {
    stability = 'experimental';
  } else {
    // For unknown components, mark as stable if they seem mature
    // Mark as experimental if they're newer or less common
    const lowerName = componentName.toLowerCase();
    if (lowerName.includes('experimental') || lowerName.includes('new') || lowerName.includes('beta')) {
      stability = 'experimental';
    } else {
      // Default to stable for unknown components (they're likely mature)
      stability = 'stable';
    }
  }

  // Add stability
  componentInfo.stability = stability;
  updated++;
}

// Write back
console.log(`\n✅ Updated ${updated} components with stability levels`);
console.log(`⏭️  Skipped ${skipped} components (already had stability)`);

// Format JSON with 2 spaces indentation
const formatted = JSON.stringify(registry, null, 2);
writeFileSync(registryPath, formatted + '\n', 'utf-8');

console.log(`\n💾 Saved to ${registryPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - Stable: ${Object.values(registry.components).filter(c => c.stability === 'stable').length}`);
console.log(`   - Experimental: ${Object.values(registry.components).filter(c => c.stability === 'experimental').length}`);
console.log(`   - Deprecated: ${Object.values(registry.components).filter(c => c.stability === 'deprecated').length}`);

