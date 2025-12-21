/**
 * Dashboard generator - generates React dashboard components from UI-DSL
 */

import type { UiDashboard, UiTable } from "../types";
import type { GeneratorOptions } from "../generator";
import { toPascalCase } from "../utils/common";
import { generateId } from "../types";
import { generateTable } from "./table-generator";

/**
 * Generate dashboard component
 */
export function generateDashboard(dsl: UiDashboard, options: GeneratorOptions): string {
  const imports: string[] = [];
  const importsFromUI: string[] = ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'MetricCard'];
  const chartImports: string[] = []; // Will be added if charts are used
  const widgets: string[] = [];

  // Process widgets
  for (const widget of dsl.widgets) {
    switch (widget.kind) {
      case 'metric':
        widgets.push(generateMetricWidget(widget));
        break;
      case 'chart':
        const chartWidget = generateChartWidget(widget);
        widgets.push(chartWidget);
        // Check if chart uses Line, Bar, or other chart components
        if (chartWidget.includes('<Line') && !chartImports.includes('Line')) {
          chartImports.push('Line');
        }
        if (chartWidget.includes('<Bar') && !chartImports.includes('Bar')) {
          chartImports.push('Bar');
        }
        if (chartWidget.includes('Select') && !importsFromUI.includes('Select')) {
          importsFromUI.push('Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem');
        }
        break;
      case 'table':
        // Generate table widget inline (don't use generateTable as it returns full component)
        if (widget.data && typeof widget.data === 'object' && 'columns' in widget.data) {
          const columns = (widget.data as any).columns || [];
          const tableData = (widget.data as any).data || [];
          
          // Add Table imports
          if (!importsFromUI.includes('Table')) {
            importsFromUI.push('Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'Badge');
          }
          
          // Generate table JSX
          const tableJSX = `<Card>
          <CardHeader>
            <CardTitle>${widget.title || 'Table'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  ${columns.map((col: any) => `<TableHead>${col.label || col.key}</TableHead>`).join('\n                  ')}
                </TableRow>
              </TableHeader>
              <TableBody>
                ${tableData.map((row: any, idx: number) => 
                  `<TableRow key="${row.id || idx}">
                    ${columns.map((col: any) => {
                      const value = row[col.key];
                      if (col.kind === 'badge') {
                        return `<TableCell><Badge>${value}</Badge></TableCell>`;
                      }
                      return `<TableCell>${value}</TableCell>`;
                    }).join('\n                    ')}
                  </TableRow>`
                ).join('\n                ')}
              </TableBody>
            </Table>
          </CardContent>
        </Card>`;
          
          widgets.push(tableJSX);
        } else {
          widgets.push(`        <Card>
          <CardHeader>
            <CardTitle>${widget.title || 'Table'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Table widget placeholder</p>
          </CardContent>
        </Card>`);
        }
        break;
    }
  }

  // Build imports
  if (options.includeImports) {
    imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
    if (chartImports.length > 0) {
      imports.push(`import { ${chartImports.join(', ')} } from "react-chartjs-2";`);
      imports.push(`import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip as ChartJSTooltip, Legend as ChartJSLegend } from "chart.js";`);
    }
    imports.push('import * as React from "react";');
    
    // Register Chart.js components after imports
    if (chartImports.length > 0) {
      imports.push('');
      imports.push('ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartJSTooltip, ChartJSLegend);');
    }
  }

  const componentName = dsl.title 
    ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
    : 'GeneratedDashboard';

  const layoutClass = dsl.layout?.maxWidth 
    ? `max-w-${dsl.layout.maxWidth}` 
    : 'max-w-7xl';

  const gap = dsl.layout?.gap || 6;

  return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${layoutClass} mx-auto p-6" data-ui-id="${dsl.id}">
      ${dsl.title ? `<h1 className="text-3xl font-bold mb-8" data-ui-id="${dsl.id}-title">${dsl.title}</h1>` : ''}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${gap}" data-ui-id="${dsl.id}-grid">
${widgets.map(w => `        ${w}`).join('\n')}
      </div>
    </div>
  );
}
`;
}

function generateMetricWidget(widget: UiDashboard['widgets'][0]): string {
  const value = widget.data?.value || '0';
  const label = widget.title || widget.data?.label || 'Metric';
  const trend = widget.data?.trend; // e.g., "+12.5%", "-20%"
  const trendValue = widget.data?.trendValue; // Numeric trend value (string)
  const trendDirection = widget.data?.trendDirection || (trendValue && parseFloat(trendValue) > 0 ? 'up' : trendValue && parseFloat(trendValue) < 0 ? 'down' : null) || (trend && trend.startsWith('+') ? 'up' : trend && trend.startsWith('-') ? 'down' : null);
  const description = widget.data?.description; // Description text below value
  
  // Use MetricCard component if available, otherwise fallback to Card
  const useMetricCard = true; // Always use MetricCard for better UX
  
  if (useMetricCard) {
    return `<MetricCard
        title="${label}"
        value="${value}"
        trend={${trendDirection ? `"${trendDirection}"` : 'undefined'}}
        trendValue={${trendValue ? `"${trendValue}"` : trend ? `"${trend}"` : 'undefined'}}
        description={${description ? `"${description}"` : 'undefined'}}
        data-ui-id="${widget.id || 'metric-widget'}"
      />`;
  }
  
  // Fallback to Card (should not be used if MetricCard is available)
  return `<Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">${label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${value}</div>
          ${trend ? `<div className="flex items-center gap-1 mt-1">
            <span className="text-xs ${trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-muted-foreground'}">${trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : ''} ${trend}</span>
          </div>` : ''}
          ${description ? `<p className="text-xs text-muted-foreground mt-2">${description}</p>` : ''}
        </CardContent>
      </Card>`;
}

function generateChartWidget(widget: UiDashboard['widgets'][0]): string {
  const title = widget.title || 'Chart';
  const chartType = widget.data?.type || 'line'; // line, bar, pie, area
  const showDateRange = widget.data?.showDateRange !== false; // Default to true
  const showViewToggle = widget.data?.showViewToggle !== false; // Default to true
  const height = widget.data?.height || 300;
  
  // Date range options
  const dateRangeOptions = widget.data?.dateRangeOptions || [
    'Last 3 months',
    'Last 30 days',
    'Last 7 days'
  ];
  
  // View toggle options (if applicable)
  const viewOptions = widget.data?.viewOptions || ['Chart', 'Table'];
  
  // Generate view toggle JSX
  const viewToggleJSX = showViewToggle 
    ? `<div className="flex items-center gap-1 border rounded-md p-1">
        ${viewOptions.map((view: string, idx: number) => 
          `<button 
            key="${idx}"
            className="px-2 py-1 text-xs rounded ${idx === 0 ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}"
            onClick={() => {/* Toggle view */}}
          >
            ${view}
          </button>`
        ).join('\n          ')}
      </div>`
    : '';
  
  // Generate date range selector JSX
  const dateRangeJSX = showDateRange
    ? `<Select defaultValue="${dateRangeOptions[0]}">
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          ${dateRangeOptions.map((option: string) => 
            `<SelectItem value="${option}">${option}</SelectItem>`
          ).join('\n          ')}
        </SelectContent>
      </Select>`
    : '';
  
  // Generate chart JSX based on type
  let chartJSX = '';
  if (chartType === 'line') {
    chartJSX = `<Line
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: '${title}',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'var(--color-brand-primary)',
          backgroundColor: 'var(--color-brand-primary)',
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        }
      }}
    />`;
  } else if (chartType === 'bar') {
    chartJSX = `<Bar
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: '${title}',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'var(--color-brand-primary)',
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        }
      }}
    />`;
  } else {
    chartJSX = `<div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
      <p className="text-sm text-muted-foreground">Chart placeholder for ${chartType}</p>
    </div>`;
  }
  
  return `<Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>${title}</CardTitle>
          <div className="flex items-center gap-2">
            ${viewToggleJSX}
            ${dateRangeJSX}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[${height}px] flex items-center justify-center">
            ${chartJSX}
          </div>
        </CardContent>
      </Card>`;
}

