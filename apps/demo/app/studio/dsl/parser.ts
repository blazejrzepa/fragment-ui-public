/**
 * UI-DSL Parser
 * 
 * Parses natural language prompts into UI-DSL structure.
 * This is a basic implementation - in production, this would use LLM.
 * 
 * v1.1: Generates UUID for all nodes to support patch operations.
 */

import type { UiDsl, UiForm, UiPage, UiTable, UiDashboard, UiDecision } from './types';
import { generateId } from './types';
import { parseDecisionPrompt } from './parser-decision';

export interface ParseResult {
  dsl: UiDsl;
  confidence: number;
  errors?: string[];
}

/**
 * Parse a natural language prompt into UI-DSL
 * 
 * This is a basic rule-based parser. In production, this would use an LLM
 * to parse the prompt into structured UI-DSL.
 */
export function parsePrompt(prompt: string): ParseResult {
  const lowerPrompt = prompt.toLowerCase();
  console.log("[Parser] parsePrompt called with prompt:", prompt.substring(0, 100));
  
  // Check for landing page FIRST (before decision patterns)
  // Landing page has priority because it's more specific
  if (lowerPrompt.includes('landing page') || 
      (lowerPrompt.includes('hero') && lowerPrompt.includes('pricing') && lowerPrompt.includes('faq'))) {
    console.log("[Parser] Detected landing page, calling parsePagePrompt");
    return parsePagePrompt(prompt);
  }
  
  // Try to detect decision patterns (most specific)
  // Compare-3 patterns: pricing with 3 plans, compare 3 options, etc.
  if (
    (lowerPrompt.includes('pricing') && (lowerPrompt.includes('3') || lowerPrompt.includes('three') || lowerPrompt.includes('plan'))) ||
    (lowerPrompt.includes('compare') && (lowerPrompt.includes('3') || lowerPrompt.includes('three') || lowerPrompt.includes('options'))) ||
    (lowerPrompt.includes('3 plans') || lowerPrompt.includes('three plans')) ||
    (lowerPrompt.includes('pricing page') && lowerPrompt.includes('plan'))
  ) {
    return parseDecisionPrompt(prompt, 'compare-3');
  }
  
  if (lowerPrompt.includes('recommendation') || lowerPrompt.includes('recommended') || lowerPrompt.includes('ranked')) {
    return parseDecisionPrompt(prompt, 'recommendation');
  }
  
  if (lowerPrompt.includes('tradeoff') || lowerPrompt.includes('cost vs risk') || lowerPrompt.includes('dimension')) {
    return parseDecisionPrompt(prompt, 'tradeoffs');
  }
  
  if (lowerPrompt.includes('review') && (lowerPrompt.includes('confirm') || lowerPrompt.includes('checkout'))) {
    return parseDecisionPrompt(prompt, 'review-confirm');
  }
  
  // Try to detect the type of UI component requested
  if (lowerPrompt.includes('form') || lowerPrompt.includes('formularz')) {
    return parseFormPrompt(prompt);
  }
  
  if (lowerPrompt.includes('table') || lowerPrompt.includes('tabela')) {
    return parseTablePrompt(prompt);
  }
  
  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('panel')) {
    return parseDashboardPrompt(prompt);
  }
  
  // General page check (landing page already handled above)
  if (lowerPrompt.includes('page') || lowerPrompt.includes('strona') || lowerPrompt.includes('settings')) {
    return parsePagePrompt(prompt);
  }
  
  // Default to form if unclear
  return parseFormPrompt(prompt);
}

/**
 * Parse a form prompt
 */
function parseFormPrompt(prompt: string): ParseResult {
  const fields: UiForm['fields'] = [];
  const actions: UiForm['actions'] = [];
  let title: string | undefined;
  
  // Extract title
  const titleMatch = prompt.match(/(?:title|tytuł|nazwa):\s*["']?([^"'\n]+)["']?/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // Check for form templates (registration, login, contact, etc.)
  const isRegistration = /(?:registration|rejestrac|rejestracyjny|sign.?up|zarejestruj)/i.test(prompt);
  const isLogin = /(?:login|logowanie|zaloguj|sign.?in)/i.test(prompt);
  const isContact = /(?:contact|kontakt)/i.test(prompt);
  const isProfile = /(?:profile|profil)/i.test(prompt);
  
  // Use template if detected
  if (isRegistration) {
    // Registration form template
    fields.push(
      {
        id: generateId(),
        name: 'firstName',
        label: 'First Name',
        component: 'Input',
        validation: 'required|minLength:2',
      },
      {
        id: generateId(),
        name: 'lastName',
        label: 'Last Name',
        component: 'Input',
        validation: 'required|minLength:2',
      },
      {
        id: generateId(),
        name: 'email',
        label: 'Email',
        component: 'Input',
        validation: 'email|required',
      },
      {
        id: generateId(),
        name: 'password',
        label: 'Password',
        component: 'PasswordInput',
        validation: 'required|minLength:8',
      },
      {
        id: generateId(),
        name: 'confirmPassword',
        label: 'Confirm Password',
        component: 'PasswordInput',
        validation: 'required',
      },
      {
        id: generateId(),
        name: 'acceptTerms',
        label: 'I accept the terms and conditions',
        component: 'Checkbox',
        validation: 'required',
      }
    );
    title = title || 'Create Your Account';
  } else if (isLogin) {
    // Login form template
    fields.push(
      {
        id: generateId(),
        name: 'email',
        label: 'Email',
        component: 'Input',
        validation: 'email|required',
      },
      {
        id: generateId(),
        name: 'password',
        label: 'Password',
        component: 'PasswordInput',
        validation: 'required',
      }
    );
    title = title || 'Sign In';
  } else if (isContact) {
    // Contact form template
    fields.push(
      {
        id: generateId(),
        name: 'name',
        label: 'Name',
        component: 'Input',
        validation: 'required',
      },
      {
        id: generateId(),
        name: 'email',
        label: 'Email',
        component: 'Input',
        validation: 'email|required',
      },
      {
        id: generateId(),
        name: 'subject',
        label: 'Subject',
        component: 'Input',
        validation: 'required',
      },
      {
        id: generateId(),
        name: 'message',
        label: 'Message',
        component: 'Textarea',
        validation: 'required',
      }
    );
    title = title || 'Contact Us';
  } else if (isProfile) {
    // Profile form template
    fields.push(
      {
        id: generateId(),
        name: 'firstName',
        label: 'First Name',
        component: 'Input',
        validation: 'required',
      },
      {
        id: generateId(),
        name: 'lastName',
        label: 'Last Name',
        component: 'Input',
        validation: 'required',
      },
      {
        id: generateId(),
        name: 'email',
        label: 'Email',
        component: 'Input',
        validation: 'email|required',
      },
      {
        id: generateId(),
        name: 'phone',
        label: 'Phone',
        component: 'Input',
        validation: 'required',
      }
    );
    title = title || 'Profile';
  } else {
    // Extract fields from prompt using patterns
    const fieldPatterns = [
      { pattern: /(?:email|e-mail)/i, component: 'Input' as const, type: 'email' },
      { pattern: /(?:password|hasło)/i, component: 'PasswordInput' as const },
      { pattern: /(?:name|imię|nazwa|first.?name|firstName)/i, component: 'Input' as const },
      { pattern: /(?:last.?name|lastName|surname|nazwisko)/i, component: 'Input' as const },
      { pattern: /(?:phone|telefon|numer)/i, component: 'Input' as const },
      { pattern: /(?:message|wiadomość)/i, component: 'Textarea' as const },
      { pattern: /(?:accept|akceptuj|checkbox|terms|zgoda)/i, component: 'Checkbox' as const },
      { pattern: /(?:subject|temat)/i, component: 'Input' as const },
    ];
    
    for (const { pattern, component } of fieldPatterns) {
      if (pattern.test(prompt)) {
        const fieldName = prompt.match(pattern)?.[0]?.toLowerCase() || 'field';
        const cleanName = fieldName.replace(/[^a-z0-9]/g, '');
        const fieldLabel = fieldName.split(/[^a-z]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        fields.push({
          id: generateId(),
          name: cleanName,
          label: fieldLabel,
          component,
          validation: component === 'Input' && pattern.source.includes('email') ? 'email|required' : 'required',
        });
      }
    }
    
    // If no fields found, create a basic form
    if (fields.length === 0) {
      fields.push({
        id: generateId(),
        name: 'input',
        label: 'Input',
        component: 'Input',
        validation: 'required',
      });
    }
  }
  
  // Add submit button
  actions.push({
    id: generateId(),
    type: 'submit',
    label: 'Submit',
    variant: 'primary',
  });
  
  const dsl: UiForm = {
    id: generateId(),
    type: 'form',
    title: title || extractTitle(prompt),
    fields,
    actions,
  };
  
  return {
    dsl,
    confidence: 0.7,
  };
}

/**
 * Parse a table prompt
 */
function parseTablePrompt(prompt: string): ParseResult {
  const columns: UiTable['columns'] = [];
  
  // Extract column names
  const columnPatterns = [
    /(?:column|kolumna|col):\s*["']?([^"'\n]+)["']?/gi,
    /(?:name|email|role|created|date)/gi,
  ];
  
  for (const pattern of columnPatterns) {
    const matches = prompt.matchAll(pattern);
    for (const match of matches) {
      const colName = match[1] || match[0];
      if (colName && !columns.find(c => c.key === colName.toLowerCase())) {
        columns.push({
          id: generateId(),
          key: colName.toLowerCase().replace(/[^a-z0-9]/g, ''),
          label: colName.charAt(0).toUpperCase() + colName.slice(1),
          kind: colName.toLowerCase().includes('date') ? 'date' : 'text',
        });
      }
    }
  }
  
  // Default columns if none found
  if (columns.length === 0) {
    columns.push(
      { id: generateId(), key: 'name', label: 'Name', kind: 'text' },
      { id: generateId(), key: 'email', label: 'Email', kind: 'text' },
      { id: generateId(), key: 'role', label: 'Role', kind: 'badge' },
    );
  }
  
  const dsl: UiTable = {
    id: generateId(),
    type: 'table',
    title: extractTitle(prompt),
    columns,
    dataSource: 'placeholder',
    pagination: { pageSize: 10 },
  };
  
  return {
    dsl,
    confidence: 0.6,
  };
}

/**
 * Parse a dashboard prompt
 */
function parseDashboardPrompt(prompt: string): ParseResult {
  const widgets: UiDashboard['widgets'] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect metrics/KPI mentions (including Polish words)
  const hasMetrics = /metric|metryk|kpi|stat|revenue|przychód|users|użytkownik|growth|wzrost|churn|utrata|conversion|aktywn|total|suma|count|liczba/i.test(lowerPrompt);
  const hasTable = /table|tabela|data table|list|lista|rows|wiersz|columns|kolumn|klient|customer|client/i.test(lowerPrompt);
  const hasCharts = /chart|wykres|graph|graf|visualization|wizualizacja|trend|analytics|analityk/i.test(lowerPrompt);
  
  // Generate metrics widgets (KPI cards)
  if (hasMetrics) {
    // Detect specific metrics from prompt
    if (/revenue|przychód|income/i.test(lowerPrompt)) {
      widgets.push({
        id: generateId(),
        kind: 'metric',
        title: 'Revenue',
        data: { value: '$0', label: 'Total Revenue', trend: '+12.5%', trendValue: 12.5, trendDirection: 'up' },
      });
    }
    if (/user|klient|customer|client/i.test(lowerPrompt)) {
      widgets.push({
        id: generateId(),
        kind: 'metric',
        title: 'Users',
        data: { value: '0', label: 'Total Users', trend: '+5.2%', trendValue: 5.2, trendDirection: 'up' },
      });
    }
    if (/growth|wzrost|growth rate/i.test(lowerPrompt)) {
      widgets.push({
        id: generateId(),
        kind: 'metric',
        title: 'Growth',
        data: { value: '0%', label: 'Growth Rate', trend: '+8.1%', trendValue: 8.1, trendDirection: 'up' },
      });
    }
    if (/churn|utrata|churn rate/i.test(lowerPrompt)) {
      widgets.push({
        id: generateId(),
        kind: 'metric',
        title: 'Churn',
        data: { value: '0%', label: 'Churn Rate', trend: '-2.3%', trendValue: -2.3, trendDirection: 'down' },
      });
    }
    
    // If no specific metrics detected but hasMetrics is true, add default metrics for professional dashboard
    // Also add default metrics for CRM/SaaS dashboards
    if (hasMetrics && widgets.length === 0) {
      widgets.push(
        { id: generateId(), kind: 'metric', title: 'Revenue', data: { value: '$0', label: 'Total Revenue', trend: '+12.5%', trendValue: 12.5, trendDirection: 'up' } },
        { id: generateId(), kind: 'metric', title: 'Users', data: { value: '0', label: 'Total Users', trend: '+5.2%', trendValue: 5.2, trendDirection: 'up' } },
        { id: generateId(), kind: 'metric', title: 'Growth', data: { value: '0%', label: 'Growth Rate', trend: '+8.1%', trendValue: 8.1, trendDirection: 'up' } },
        { id: generateId(), kind: 'metric', title: 'Churn', data: { value: '0%', label: 'Churn Rate', trend: '-2.3%', trendValue: -2.3, trendDirection: 'down' } },
      );
    }
    
    // For CRM/SaaS dashboards, always add multiple metrics if not already added
    if ((/crm|saas|business|enterprise/i.test(lowerPrompt)) && widgets.filter(w => w.kind === 'metric').length < 2) {
      const existingMetrics = widgets.filter(w => w.kind === 'metric').length;
      if (existingMetrics === 0) {
        widgets.unshift(
          { id: generateId(), kind: 'metric', title: 'Revenue', data: { value: '$0', label: 'Total Revenue', trend: '+12.5%', trendValue: 12.5, trendDirection: 'up' } },
          { id: generateId(), kind: 'metric', title: 'Users', data: { value: '0', label: 'Total Users', trend: '+5.2%', trendValue: 5.2, trendDirection: 'up' } },
          { id: generateId(), kind: 'metric', title: 'Growth', data: { value: '0%', label: 'Growth Rate', trend: '+8.1%', trendValue: 8.1, trendDirection: 'up' } },
        );
      } else if (existingMetrics === 1) {
        // Add more metrics if only one exists
        widgets.push(
          { id: generateId(), kind: 'metric', title: 'Revenue', data: { value: '$0', label: 'Total Revenue', trend: '+12.5%', trendValue: 12.5, trendDirection: 'up' } },
          { id: generateId(), kind: 'metric', title: 'Growth', data: { value: '0%', label: 'Growth Rate', trend: '+8.1%', trendValue: 8.1, trendDirection: 'up' } },
        );
      }
    }
  }
  
  // Generate table widget
  if (hasTable) {
    // Detect table type from prompt
    const tableTitle = /klient|customer|client/i.test(lowerPrompt) ? 'Customers' :
                      /user/i.test(lowerPrompt) ? 'Users' :
                      /order|zamówienie/i.test(lowerPrompt) ? 'Orders' :
                      'Data Table';
    
    widgets.push({
      id: generateId(),
      kind: 'table',
      title: tableTitle,
      data: {
        columns: [
          { id: generateId(), key: 'id', label: 'ID', kind: 'text', sortable: true },
          { id: generateId(), key: 'name', label: 'Name', kind: 'text', sortable: true, filterable: true },
          { id: generateId(), key: 'status', label: 'Status', kind: 'badge', filterable: true },
          { id: generateId(), key: 'date', label: 'Date', kind: 'date', sortable: true },
        ],
        data: [
          { id: '1', name: 'John Doe', status: 'Active', date: '2023-01-15' },
          { id: '2', name: 'Jane Smith', status: 'Inactive', date: '2023-02-20' },
          { id: '3', name: 'Bob Johnson', status: 'Active', date: '2023-03-10' },
        ],
      },
    });
  }
  
  // Generate chart widgets
  if (hasCharts) {
    // Detect chart type from prompt
    const chartCount = (lowerPrompt.match(/chart|wykres|graph/gi) || []).length;
    const hasLineChart = /line|linia|trend|time|czas/i.test(lowerPrompt);
    const hasBarChart = /bar|słupkowy|column/i.test(lowerPrompt);
    
    if (hasLineChart || chartCount > 1) {
      widgets.push({
        id: generateId(),
        kind: 'chart',
        title: 'Sales Trend',
        data: { type: 'line', showDateRange: true, showViewToggle: true },
      });
    }
    if (hasBarChart || chartCount > 1) {
      widgets.push({
        id: generateId(),
        kind: 'chart',
        title: 'Revenue by Category',
        data: { type: 'bar', showDateRange: true, showViewToggle: true },
      });
    }
    
    // If no specific chart type detected, add default chart
    if (!hasLineChart && !hasBarChart) {
      widgets.push({
        id: generateId(),
        kind: 'chart',
        title: 'Analytics Chart',
        data: { type: 'line', showDateRange: true, showViewToggle: true },
      });
    }
  }
  
  // Default widgets if nothing detected (shouldn't happen for dashboard prompts)
  if (widgets.length === 0) {
    widgets.push(
      { id: generateId(), kind: 'metric', title: 'Revenue', data: { value: '$0', label: 'Total Revenue', trend: '+12.5%', trendValue: 12.5, trendDirection: 'up' } },
      { id: generateId(), kind: 'metric', title: 'Users', data: { value: '0', label: 'Total Users', trend: '+5.2%', trendValue: 5.2, trendDirection: 'up' } },
      { id: generateId(), kind: 'chart', title: 'Sales Chart', data: { type: 'line', showDateRange: true, showViewToggle: true } },
    );
  }
  
  const dsl: UiDashboard = {
    id: generateId(),
    type: 'dashboard',
    title: extractTitle(prompt),
    widgets,
  };
  
  return {
    dsl,
    confidence: 0.8, // Higher confidence with better detection
  };
}

/**
 * Parse a page prompt
 */
function parsePagePrompt(prompt: string): ParseResult {
  const lowerPrompt = prompt.toLowerCase();
  console.log("[Parser] parsePagePrompt called with prompt:", prompt.substring(0, 50));
  
  // Check for landing page with hero, pricing, FAQ
  const isLandingPage = lowerPrompt.includes('landing page') || 
    (lowerPrompt.includes('hero') && lowerPrompt.includes('pricing') && lowerPrompt.includes('faq'));
  
  console.log("[Parser] isLandingPage:", isLandingPage, {
    hasLandingPage: lowerPrompt.includes('landing page'),
    hasHero: lowerPrompt.includes('hero'),
    hasPricing: lowerPrompt.includes('pricing'),
    hasFaq: lowerPrompt.includes('faq')
  });
  
  if (isLandingPage) {
    console.log("[Parser] Detected landing page, generating Screen DSL");
    // Generate Screen DSL with regions and modules
    const modules: any[] = [];
    
    // Hero module
    if (lowerPrompt.includes('hero')) {
      modules.push({
        id: generateId(),
        type: 'hero' as const,
        title: 'Welcome to Our Service',
        description: 'Get started with our amazing product today',
      });
    }
    
    // Pricing module
    if (lowerPrompt.includes('pricing')) {
      const tierCountMatch = prompt.match(/(\d+)\s*(?:tier|plan|option)/i);
      const tierCount = tierCountMatch ? parseInt(tierCountMatch[1]) : 3;
      modules.push({
        id: generateId(),
        type: 'pricing' as const,
        title: 'Pricing',
        props: {
          tiers: Array.from({ length: tierCount }, (_, i) => ({
            name: i === 0 ? 'Basic' : i === 1 ? 'Pro' : 'Enterprise',
            price: `$${(i + 1) * 10}`,
            features: Array.from({ length: 3 + i }, (_, j) => ({
              name: `Feature ${j + 1}`,
              included: true,
            })),
            ctaText: 'Get Started',
            popular: i === 1, // Middle tier is popular
          })),
        },
      });
    }
    
    // FAQ module
    if (lowerPrompt.includes('faq')) {
      modules.push({
        id: generateId(),
        type: 'faq' as const,
        title: 'Frequently Asked Questions',
        props: {
          questions: [
            { q: 'What is this service?', a: 'This is a comprehensive solution for your needs.' },
            { q: 'How do I get started?', a: 'Simply sign up and follow the onboarding process.' },
            { q: 'What are the pricing options?', a: 'We offer flexible pricing plans to suit your needs.' },
          ],
        },
      });
    }
    
    // Generate Screen DSL with regions
    const dsl: UiPage = {
      id: generateId(),
      type: 'page',
      title: extractTitle(prompt) || 'Landing Page',
      regions: {
        header: {
          id: generateId(),
          modules: [{
            id: generateId(),
            type: 'navigation' as const,
            title: 'Navigation',
          }],
        },
        sidebar: {
          id: generateId(),
          modules: [],
        },
        content: {
          id: generateId(),
          modules,
        },
        footer: {
          id: generateId(),
          modules: [{
            id: generateId(),
            type: 'footer' as const,
            title: 'Footer',
          }],
        },
        main: {
          id: generateId(),
          modules: [],
        },
      },
      sections: [], // Empty sections for Screen DSL
    };
    
    console.log("[Parser] Generated Screen DSL:", { 
      type: dsl.type, 
      hasRegions: !!dsl.regions, 
      modulesCount: modules.length,
      headerModules: dsl.regions?.header?.modules?.length,
      contentModules: dsl.regions?.content?.modules?.length
    });
    
    return {
      dsl,
      confidence: 0.9,
    };
  }
  
  // Look for tabs
  if (prompt.match(/(?:tab|zakładka)/i)) {
    const sections: UiPage['sections'] = [{
      id: generateId(),
      kind: 'tabs',
      title: 'Settings',
      content: {
        'Profile': [],
        'Security': [],
        'Notifications': [],
      },
    }];
    
    const dsl: UiPage = {
      id: generateId(),
      type: 'page',
      title: extractTitle(prompt),
      sections,
    };
    
    return {
      dsl,
      confidence: 0.5,
    };
  }
  
  // Default to card sections
  const sections: UiPage['sections'] = [{
    id: generateId(),
    kind: 'card',
    title: 'Section 1',
    content: [],
  }];
  
  const dsl: UiPage = {
    id: generateId(),
    type: 'page',
    title: extractTitle(prompt),
    sections,
  };
  
  return {
    dsl,
    confidence: 0.5,
  };
}

/**
 * Extract title from prompt
 */
function extractTitle(prompt: string): string | undefined {
  // Try to find title in quotes
  const quotedMatch = prompt.match(/(?:title|tytuł):\s*["']([^"']+)["']/i);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  
  // Try to find first capitalized phrase
  const capitalizedMatch = prompt.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
  if (capitalizedMatch) {
    return capitalizedMatch[1];
  }
  
  return undefined;
}

