/**
 * Module type generators - specific implementations for each module type
 */

import type { UiModule } from "../../types";
import { resolveDataSource } from "../../utils/data-utils";

/**
 * Generate Hero module
 */
export function generateHeroModule(module: UiModule): string {
  const title = module.title || module.props?.title || 'Welcome';
  const description = module.description || module.props?.description || '';
  const ctaText = module.props?.ctaText || 'Get Started';
  
  return `<div className="text-center py-12" data-ui-id="${module.id}" data-module-type="hero">
      <h1 className="text-4xl font-bold mb-4">${title}</h1>
      ${description ? `<p className="text-lg text-[color:var(--color-fg-muted)] mb-8">${description}</p>` : ''}
      <Button variant="solid" data-ui-id="${module.id}-cta">${ctaText}</Button>
    </div>`;
}

/**
 * Generate Pricing module
 */
export function generatePricingModule(module: UiModule): string {
  const tiers = module.props?.tiers || [
    { name: 'Basic', price: '$9', features: [{ name: 'Feature 1', included: true }, { name: 'Feature 2', included: true }] },
    { name: 'Pro', price: '$29', features: [{ name: 'Feature 1', included: true }, { name: 'Feature 2', included: true }, { name: 'Feature 3', included: true }] },
    { name: 'Enterprise', price: '$99', features: [{ name: 'All features', included: true }, { name: 'Support', included: true }] },
  ];
  
  const tiersJSX = tiers.map((tier: any, idx: number) => {
    const featuresList = tier.features.map((f: any) => {
      if (typeof f === 'string') {
        return `<li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>${f}</span>
          </li>`;
      } else {
        return f.included 
          ? `<li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>${f.name}</span>
            </li>`
          : `<li className="flex items-center gap-2 text-muted-foreground">
              <span>✗</span>
              <span>${f.name}</span>
            </li>`;
      }
    }).join('\n            ');
    
    return `<Card key="${idx}" className="p-6 ${tier.popular ? 'border-2 border-[color:var(--color-border-accent)]' : ''}" data-ui-id="${module.id}-tier-${idx}">
        <CardHeader>
          <CardTitle>${tier.name}</CardTitle>
          <div className="text-3xl font-bold">${tier.price}</div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-6">
            ${featuresList}
          </ul>
          <Button className="w-full" variant="${tier.popular ? 'solid' : 'outline'}" data-ui-id="${module.id}-tier-${idx}-cta">${tier.ctaText || `Choose ${tier.name}`}</Button>
        </CardContent>
      </Card>`;
  }).join('\n      ');
  
  return `<div className="py-12" data-ui-id="${module.id}" data-module-type="pricing">
      ${module.title ? `<h2 className="text-3xl font-bold text-center mb-8">${module.title}</h2>` : ''}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${tiersJSX}
      </div>
    </div>`;
}

/**
 * Generate FAQ module
 */
export function generateFaqModule(module: UiModule): string {
  const questions = module.props?.questions || [
    { q: 'Question 1?', a: 'Answer 1' },
    { q: 'Question 2?', a: 'Answer 2' },
  ];
  
  const itemsJSX = questions.map((item: any, idx: number) =>
    `<div key="${idx}" className="border-b border-[color:var(--color-border-primary)] py-4">
        <h3 className="font-semibold mb-2">${item.q}</h3>
        <p className="text-muted-foreground">${item.a}</p>
      </div>`
  ).join('\n        ');
  
  return `<div className="py-12" data-ui-id="${module.id}" data-module-type="faq">
      ${module.title ? `<h2 className="text-3xl font-bold mb-8">${module.title}</h2>` : ''}
      <div className="space-y-4">
        ${itemsJSX}
      </div>
    </div>`;
}

/**
 * Generate Testimonials module
 */
export function generateTestimonialsModule(module: UiModule): string {
  const defaultTestimonials = [
    { name: 'John Doe', text: 'Great product!', role: 'CEO' },
    { name: 'Jane Smith', text: 'Love it!', role: 'CTO' },
  ];
  
  const testimonials = resolveDataSource(module.data, defaultTestimonials);
  
  const itemsJSX = (Array.isArray(testimonials) ? testimonials : defaultTestimonials).map((t: any, idx: number) =>
    `<Card key="${idx}" className="p-6">
        <CardContent>
          <p className="mb-4">"${t.text || t.message || ''}"</p>
          <div className="text-sm">
            <div className="font-semibold">${t.name || t.author || ''}</div>
            <div className="text-muted-foreground">${t.role || t.position || ''}</div>
          </div>
        </CardContent>
      </Card>`
  ).join('\n        ');
  
  return `<div className="py-12" data-ui-id="${module.id}" data-module-type="testimonials">
      ${module.title ? `<h2 className="text-3xl font-bold mb-8">${module.title}</h2>` : ''}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${itemsJSX}
      </div>
    </div>`;
}

/**
 * Generate KPI Header module
 */
export function generateKpiHeaderModule(module: UiModule): string {
  const defaultKpis = [
    { label: 'Revenue', value: '$10k', trend: '+5%' },
    { label: 'Users', value: '1.2k', trend: '+12%' },
  ];
  
  const kpis = resolveDataSource(module.data, defaultKpis);
  
  const kpisJSX = (Array.isArray(kpis) ? kpis : defaultKpis).map((kpi: any, idx: number) =>
    `<div key="${idx}" className="text-center">
        <div className="text-2xl font-bold">${kpi.value || kpi.metric || '0'}</div>
        <div className="text-sm text-muted-foreground">${kpi.label || kpi.name || ''}</div>
        ${kpi.trend ? `<div className="text-xs text-green-600">${kpi.trend}</div>` : ''}
      </div>`
  ).join('\n        ');
  
  return `<div className="border-b border-[color:var(--color-border-primary)] p-4" data-ui-id="${module.id}" data-module-type="kpi-header">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${kpisJSX}
      </div>
    </div>`;
}

/**
 * Generate Navigation module
 */
export function generateNavigationModule(module: UiModule): string {
  const moduleType = module.type || 'navigation';
  const isHeader = moduleType === 'navigation-header';
  const isSidebar = moduleType === 'navigation-sidebar';
  
  // Add Input import if search is enabled
  if (isHeader && module.props?.showSearch !== false) {
    // Input will be added to imports by module-generator if needed
  }
  
  // Header navigation
  if (isHeader) {
    const logo = module.props?.logo;
    const logoText = typeof logo === 'string' ? logo : (logo?.text || logo?.alt || 'Logo');
    const logoSrc = typeof logo === 'object' ? logo.src : undefined;
    const items = module.props?.items || [];
    const userMenu = module.props?.userMenu;
    const showSearch = module.props?.showSearch !== false; // Default to true
    
    return `<nav className="flex items-center justify-between border-b border-[color:var(--color-border-primary)] px-6 py-4 bg-[color:var(--color-surface-1)]" data-ui-id="${module.id}" data-module-type="navigation-header">
      <div className="flex items-center gap-4">
        ${logoSrc ? `<img src="${logoSrc}" alt="${logoText}" className="h-8" />` : ''}
        <div className="font-bold text-lg">${logoText}</div>
      </div>
      <div className="flex items-center gap-6 flex-1 justify-center">
        ${items.map((item: any) => 
          `<a href="${item.href || '#'}" className="text-sm ${item.active ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}">${item.label || item}</a>`
        ).join('\n        ')}
      </div>
      <div className="flex items-center gap-4">
        ${showSearch ? `<div className="relative">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-[200px] h-9"
          />
        </div>` : ''}
        ${userMenu ? `<div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          ${userMenu.avatar ? `<img src="${userMenu.avatar}" alt="${userMenu.name}" className="h-8 w-8 rounded-full" />` : `<div className="h-8 w-8 rounded-full bg-[color:var(--color-brand-primary)] flex items-center justify-center text-white text-sm font-medium">${(userMenu.name || 'U').charAt(0).toUpperCase()}</div>`}
          <div className="text-sm">
            <div className="font-medium">${userMenu.name || 'User'}</div>
            ${userMenu.email ? `<div className="text-xs text-muted-foreground">${userMenu.email}</div>` : ''}
          </div>
        </div>` : ''}
      </div>
    </nav>`;
  }
  
  // Sidebar navigation
  if (isSidebar) {
    const items = module.props?.items || [];
    const groups = module.props?.groups || []; // Collapsible groups (e.g., Documents with submenu)
    const footer = module.props?.footer;
    
    // Generate regular items
    const itemsJSX = items.map((item: any) => {
      const icon = item.icon ? `<span className="mr-2">${item.icon}</span>` : '';
      return `<a href="${item.href || '#'}" className="flex items-center px-3 py-2 text-sm rounded-md ${item.active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}">
          ${icon}${item.label || item}
        </a>`;
    }).join('\n        ');
    
    // Generate collapsible groups
    const groupsJSX = groups.map((group: any) => {
      const groupItems = group.items || [];
      const groupId = `group-${group.label?.toLowerCase().replace(/\s+/g, '-') || 'group'}`;
      return `<div className="space-y-1">
          <button 
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            onClick={(e) => {
              e.preventDefault();
              const submenu = document.getElementById('${groupId}-submenu');
              if (submenu) {
                submenu.classList.toggle('hidden');
              }
            }}
          >
            <span>${group.label || 'Group'}</span>
            <span className="text-xs">▼</span>
          </button>
          <div id="${groupId}-submenu" className="pl-4 space-y-1 ${group.collapsed !== false ? 'hidden' : ''}">
            ${groupItems.map((subItem: any) => 
              `<a href="${subItem.href || '#'}" className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                ${subItem.label || subItem}
              </a>`
            ).join('\n            ')}
          </div>
        </div>`;
    }).join('\n        ');
    
    return `<nav className="flex flex-col h-full border-r border-[color:var(--color-border-primary)] p-4 w-64 bg-[color:var(--color-surface-1)]" data-ui-id="${module.id}" data-module-type="navigation-sidebar">
      <div className="flex-1 space-y-1 overflow-y-auto">
        ${itemsJSX}
        ${groupsJSX}
      </div>
      ${footer ? `<div className="mt-auto pt-4 border-t border-[color:var(--color-border-primary)]">
        ${footer.userMenu ? `<div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent cursor-pointer">
          ${footer.userMenu.avatar ? `<img src="${footer.userMenu.avatar}" alt="${footer.userMenu.name}" className="h-8 w-8 rounded-full" />` : `<div className="h-8 w-8 rounded-full bg-[color:var(--color-brand-primary)] flex items-center justify-center text-white text-sm font-medium">${(footer.userMenu.name || 'U').charAt(0).toUpperCase()}</div>`}
          <div className="flex-1 text-sm">
            <div className="font-medium">${footer.userMenu.name || 'User'}</div>
            ${footer.userMenu.email ? `<div className="text-xs text-muted-foreground">${footer.userMenu.email}</div>` : ''}
          </div>
        </div>` : ''}
        ${footer.label ? `<div className="text-xs text-muted-foreground px-3 py-2">
          ${footer.label}
        </div>` : ''}
      </div>` : ''}
    </nav>`;
  }
  
  // Default navigation (horizontal)
  const items = module.props?.items || ['Home', 'About', 'Contact'];
  
  return `<nav className="flex items-center justify-between" data-ui-id="${module.id}" data-module-type="navigation">
      <div className="font-bold">${module.props?.logo || 'Logo'}</div>
      <div className="flex gap-4">
        ${items.map((item: string) => `<a href="#" className="text-sm">${item}</a>`).join('\n        ')}
      </div>
    </nav>`;
}

/**
 * Generate Footer module
 */
export function generateFooterModule(module: UiModule): string {
  const links = module.props?.links || { 'Company': ['About', 'Contact'], 'Legal': ['Privacy', 'Terms'] };
  
  const linksJSX = Object.entries(links).map(([category, items]: [string, any]) =>
    `<div>
        <h4 className="font-semibold mb-2">${category}</h4>
        <ul className="space-y-1">
          ${items.map((item: string) => `<li><a href="#" className="text-sm text-muted-foreground">${item}</a></li>`).join('\n          ')}
        </ul>
      </div>`
  ).join('\n        ');
  
  return `<footer className="border-t border-[color:var(--color-border-primary)] p-8" data-ui-id="${module.id}" data-module-type="footer">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        ${linksJSX}
      </div>
    </footer>`;
}

/**
 * Generate Features module
 */
export function generateFeaturesModule(module: UiModule): string {
  const features = module.props?.features || [
    { title: 'Feature 1', description: 'Description 1' },
    { title: 'Feature 2', description: 'Description 2' },
  ];
  
  const itemsJSX = features.map((f: any, idx: number) =>
    `<Card key="${idx}">
        <CardHeader>
          <CardTitle>${f.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>${f.description}</p>
        </CardContent>
      </Card>`
  ).join('\n        ');
  
  return `<div className="py-12" data-ui-id="${module.id}" data-module-type="features">
      ${module.title ? `<h2 className="text-3xl font-bold text-center mb-8">${module.title}</h2>` : ''}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${itemsJSX}
      </div>
    </div>`;
}

/**
 * Generate Proof module (social proof)
 */
export function generateProofModule(module: UiModule): string {
  const logos = module.props?.logos || ['Logo 1', 'Logo 2', 'Logo 3'];
  
  return `<div className="py-8 border-y border-[color:var(--color-border-primary)]" data-ui-id="${module.id}" data-module-type="proof">
      ${module.title ? `<p className="text-sm text-center text-muted-foreground mb-4">${module.title}</p>` : ''}
      <div className="flex justify-center items-center gap-8">
        ${logos.map((logo: string) => `<div className="text-muted-foreground">${logo}</div>`).join('\n        ')}
      </div>
    </div>`;
}

/**
 * Generate CTA module
 */
export function generateCtaModule(module: UiModule): string {
  const title = module.title || module.props?.title || 'Ready to get started?';
  const description = module.description || module.props?.description || '';
  const ctaText = module.props?.ctaText || 'Get Started';
  
  return `<div className="py-12 text-center bg-[color:var(--color-surface-2)] rounded-lg" data-ui-id="${module.id}" data-module-type="cta">
      <h2 className="text-3xl font-bold mb-4">${title}</h2>
      ${description ? `<p className="text-lg text-muted-foreground mb-8">${description}</p>` : ''}
      <Button variant="primary" size="lg" data-ui-id="${module.id}-cta">${ctaText}</Button>
    </div>`;
}

/**
 * Generate Breadcrumbs module
 */
export function generateBreadcrumbsModule(module: UiModule): string {
  const items = module.props?.items || ['Home', 'Page', 'Current'];
  
  return `<nav className="flex items-center gap-2 text-sm mb-4" data-ui-id="${module.id}" data-module-type="breadcrumbs">
      ${items.map((item: string, idx: number) => 
        idx === items.length - 1 
          ? `<span className="font-semibold">${item}</span>`
          : `<><a href="#" className="text-muted-foreground hover:underline">${item}</a> <span className="text-muted-foreground">/</span></>`
      ).join('\n        ')}
    </nav>`;
}

/**
 * Generate Data Table Section module
 */
export function generateDataTableSectionModule(module: UiModule): string {
  const defaultColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ];
  
  const defaultData = [
    { id: '1', name: 'Item 1', status: 'Active' },
    { id: '2', name: 'Item 2', status: 'Pending' },
    { id: '3', name: 'Item 3', status: 'Active' },
  ];
  
  const columns = module.props?.columns || defaultColumns;
  const data = resolveDataSource(module.data, defaultData);
  const tableData = Array.isArray(data) ? data : defaultData;
  
  const headersJSX = columns.map((col: any) =>
    `<TableHead key="${col.key || col.id}">${col.label || col.name || col.key}</TableHead>`
  ).join('\n            ');
  
  const rowsJSX = tableData.map((row: any, idx: number) => {
    const cellsJSX = columns.map((col: any) => {
      const value = row[col.key || col.id] || '';
      return `<TableCell key="${col.key || col.id}">${value}</TableCell>`;
    }).join('\n                ');
    
    return `<TableRow key="${idx}">
                ${cellsJSX}
              </TableRow>`;
  }).join('\n            ');
  
  return `<div className="py-6" data-ui-id="${module.id}" data-module-type="data-table-section">
      ${module.title ? `<h2 className="text-2xl font-bold mb-4">${module.title}</h2>` : ''}
      <div className="border border-[color:var(--color-border-primary)] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              ${headersJSX}
            </TableRow>
          </TableHeader>
          <TableBody>
            ${rowsJSX}
          </TableBody>
        </Table>
      </div>
    </div>`;
}

