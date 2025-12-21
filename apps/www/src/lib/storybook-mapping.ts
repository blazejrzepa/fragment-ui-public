/**
 * Mapping from component/block names to Storybook story IDs
 * This is used to generate Storybook links from registry component names
 * 
 * Storybook ID format: category-name--story-name
 * Examples:
 * - Core/Button -> core-button--docs or core-button--default
 * - Blocks/DataTable -> blocks-datatable--docs or blocks-datatable--default
 */

interface StorybookMapping {
  [componentName: string]: string;
}

/**
 * Map component name from registry.json to Storybook story ID
 * Returns empty string if component doesn't have stories
 */
export function getStorybookPath(componentName: string): string {
  // Complete mapping based on actual Storybook titles
  const mapping: StorybookMapping = {
    // Core components (Core/*)
    "accordion": "/docs/disclosure-accordion--docs",
    "aspect-ratio": "/docs/core-aspectratio--docs",
    "alert": "/docs/core-alertdialog--docs",
    "alert-dialog": "/docs/core-alertdialog--docs",
    "avatar": "/docs/display-avatar--docs",
    "badge": "/docs/core-badge--docs",
    "breadcrumbs": "/docs/core-breadcrumbs--docs",
    "button": "/docs/core-button--docs",
    "card": "/docs/display-card--docs",
    "carousel": "/docs/core-carousel--docs",
    "checkbox": "/docs/core-checkbox--docs",
    "collapsible": "/docs/core-collapsible--docs",
    "combobox": "/docs/core-combobox--docs",
    "command-palette": "/story/core-commandpalette--default",
    "context-menu": "/docs/core-contextmenu--docs",
    "date-picker": "/story/core-datepicker--default",
    "dialog": "/docs/core-dialog--docs",
    "dropdown-menu": "/docs/overlay-dropdown-menu--docs",
    "form-field": "/docs/form-formfield--docs",
    "hover-card": "/docs/core-hovercard--docs",
          "input": "/docs/core-input--docs",
          "menubar": "/docs/core-menubar--docs",
          "multi-select": "/story/core-multiselect--default",
          "navigation-menu": "/docs/core-navigationmenu--docs",
    "pagination": "/docs/core-pagination--docs",
    "popover": "/docs/overlay-popover--docs",
    "progress": "/docs/feedback-progress--docs",
    "radio": "/docs/core-radio--docs",
    "resizable": "/docs/core-resizable--docs",
    "scroll-area": "/docs/core-scrollarea--docs",
    "select": "/docs/core-select--docs",
    "separator": "/docs/layout-separator--docs",
    "sheet": "/docs/core-sheet--docs",
    "skeleton": "/docs/feedback-skeleton--docs",
    "slider": "/docs/core-slider--docs",
    "spinner": "/docs/feedback-spinner--docs",
    "stepper": "/story/core-stepper--default",
    "switch": "/docs/core-switch--docs",
    "table": "/docs/core-table--docs",
    "tabs": "/docs/core-tabs--docs",
    "textarea": "/docs/core-textarea--docs",
    "timeline": "/story/core-timeline--default",
    "toast": "/docs/core-toast--docs",
    "tree-view": "/story/core-treeview--default",
    "color-picker": "/story/core-colorpicker--default",
    "toggle": "/docs/core-toggle--docs",
    "toggle-group": "/docs/core-togglegroup--docs",
    "segmented-control": "/docs/components-segmentedcontrol--docs",
    "rating": "/docs/components-rating--docs",
    "file-upload": "/docs/components-fileupload--docs",
    "split-button": "/docs/components-splitbutton--docs",
    "tag-input": "/docs/components-taginput--docs",
    "tooltip": "/docs/overlay-tooltip--docs",
    "virtual-list": "/docs/core-virtuallist--docs",
    "virtual-table": "/docs/core-virtualtable--docs",
    
    // Blocks (Blocks/*) - use docs pages if available (they have autodocs tag)
    "data-table": "/docs/blocks-datatable--docs",
    "pricing-table": "/docs/blocks-pricingtable--docs",
    // AuthenticationBlock - try docs page first, fallback to story if needed
    "authentication-block": "/docs/blocks-authenticationblock--docs",
    
    // Components/blocks without stories - return empty string to hide Storybook link
    "settings-screen": "",
    "dashboard-layout": "",
    "navigation-header": "",
    "form-container": "",
    "card-grid": "",
  };

  // Direct mapping
  if (mapping[componentName] !== undefined) {
    return mapping[componentName];
  }

  // If not found, return empty string (no Storybook link)
  // This prevents broken links for components without stories
  return "";
}
