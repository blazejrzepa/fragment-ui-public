/**
 * Table generator - generates React table components from UI-DSL
 * 
 * Enhanced to use DataTable component with sorting, filtering, pagination, row selection
 */

import type { UiTable } from "../types";
import type { GeneratorOptions } from "../generator";
import { toPascalCase } from "../utils/common";

/**
 * Generate table component
 */
export function generateTable(dsl: UiTable, options: GeneratorOptions): string {
  const imports: string[] = [];
  // Use DataTable for enhanced features (sorting, filtering, pagination, row selection)
  const useDataTable = dsl.sortable || dsl.filterable || dsl.pagination || dsl.selectable;
  const importsFromUI: string[] = [];
  
  // Generate sample data
  const sampleData = dsl.data || Array.from({ length: 10 }, (_, i) => {
    const row: Record<string, any> = { id: `row-${i + 1}` };
    dsl.columns.forEach(col => {
      if (col.kind === 'badge') {
        row[col.key] = i % 2 === 0 ? 'Active' : 'Inactive';
      } else if (col.kind === 'date') {
        row[col.key] = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      } else {
        row[col.key] = `Sample ${col.label} ${i + 1}`;
      }
    });
    return row;
  });

  if (useDataTable) {
    // Use DataTable component
    importsFromUI.push('DataTable');
    
    // Generate column definitions
    const columnDefinitions: string[] = [];
    dsl.columns.forEach((col, idx) => {
      const accessor = `(row) => row.${col.key}`;
      const cellRenderer = col.kind === 'badge' 
        ? `(row) => <Badge>${accessor}</Badge>`
        : col.kind === 'date'
        ? `(row) => new Date(${accessor}).toLocaleDateString()`
        : accessor;
      
      columnDefinitions.push(`    {
      id: "${col.id || col.key}",
      header: "${col.label}",
      accessor: ${cellRenderer},
      sortable: ${col.sortable !== false && dsl.sortable ? 'true' : 'false'},
      filterable: ${col.filterable !== false && dsl.filterable ? 'true' : 'false'},
      ${col.width ? `width: "${col.width}",` : ''}
    }`);
      
      if (col.kind === 'badge' && !importsFromUI.includes('Badge')) {
        importsFromUI.push('Badge');
      }
    });

    // Generate data array
    const dataArray = sampleData.map(row => {
      const rowStr = Object.entries(row)
        .map(([key, value]) => `      ${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
        .join(',\n');
      return `    {\n${rowStr}\n    }`;
    }).join(',\n');

    // Generate pagination component if needed
    let paginationCode = '';
    if (dsl.pagination) {
      paginationCode = `
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = ${dsl.pagination.pageSize};
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const paginationControls = (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} row(s)
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="flex items-center px-4 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );`;
      
      if (!importsFromUI.includes('Button')) {
        importsFromUI.push('Button');
      }
    }

    const componentName = dsl.title 
      ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
      : 'GeneratedTable';

    const layoutClass = dsl.layout?.maxWidth 
      ? `max-w-${dsl.layout.maxWidth}` 
      : 'max-w-7xl';

    // Build imports
    if (options.includeImports) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
      imports.push('import * as React from "react";');
    }

    return `${imports.join('\n')}

export default function ${componentName}() {
  const columns = [
${columnDefinitions.join(',\n')}
  ];

  const data = [
${dataArray}
  ];
${paginationCode}
  
  return (
    <div className="${layoutClass} mx-auto p-6 space-y-4">
      ${dsl.title ? `<h1 className="text-2xl font-bold mb-4">${dsl.title}</h1>` : ''}
      ${dsl.filters && dsl.filters.length > 0 ? `<div className="flex gap-4 mb-4">
${dsl.filters.map(filter => {
  if (filter.type === 'search') {
    return `        <Input placeholder="Search ${filter.key}..." className="max-w-sm" />`;
  } else if (filter.type === 'select') {
    const options = filter.options || [];
    return `        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="${filter.placeholder || 'Select...'}" />
          </SelectTrigger>
          <SelectContent>
            ${options.map(opt => `            <SelectItem value="${opt}">${opt}</SelectItem>`).join('\n')}
          </SelectContent>
        </Select>`;
  }
  return '';
}).filter(Boolean).join('\n')}
      </div>` : ''}
      <DataTable
        data={${dsl.pagination ? 'paginatedData' : 'data'}}
        columns={columns}
        sortable={${dsl.sortable ? 'true' : 'false'}}
        filterable={${dsl.filterable ? 'true' : 'false'}}
        selectable={${dsl.selectable ? 'true' : 'false'}}
        emptyMessage="No data available"
      />
      ${dsl.pagination ? '{paginationControls}' : ''}
    </div>
  );
}
`;
  } else {
    // Use basic Table component
    importsFromUI.push('Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell');
    const columns: string[] = [];
    const rows: string[] = [];

    // Process columns
    for (const column of dsl.columns) {
      columns.push(`        <TableHead>${column.label}</TableHead>`);
    }

    // Process filters
    const filters: string[] = [];
    if (dsl.filters) {
      for (const filter of dsl.filters) {
        if (filter.type === 'search') {
          if (!importsFromUI.includes('Input')) {
            importsFromUI.push('Input');
          }
          filters.push(`        <Input placeholder="Search ${filter.key}..." className="max-w-sm" />`);
        } else if (filter.type === 'select') {
          if (!importsFromUI.includes('Select')) {
            importsFromUI.push('Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem');
          }
          const options = filter.options || [];
          filters.push(`        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="${filter.placeholder || 'Select...'}" />
          </SelectTrigger>
          <SelectContent>
            ${options.map(opt => `            <SelectItem value="${opt}">${opt}</SelectItem>`).join('\n')}
          </SelectContent>
        </Select>`);
        }
      }
    }

    // Generate rows
    for (const rowData of sampleData) {
      const cells = dsl.columns.map(col => {
        const value = rowData[col.key] || '';
        if (col.kind === 'badge') {
          if (!importsFromUI.includes('Badge')) {
            importsFromUI.push('Badge');
          }
          return `          <TableCell><Badge>${value}</Badge></TableCell>`;
        }
        return `          <TableCell>${value}</TableCell>`;
      });
      rows.push(`        <TableRow>
${cells.join('\n')}
        </TableRow>`);
    }

    // Build imports
    if (options.includeImports) {
      imports.push(`import { ${importsFromUI.join(', ')} } from "@fragment_ui/ui";`);
      imports.push('import * as React from "react";');
    }

    const componentName = dsl.title 
      ? toPascalCase(dsl.title.replace(/[^a-zA-Z0-9]/g, ' '))
      : 'GeneratedTable';

    const layoutClass = dsl.layout?.maxWidth 
      ? `max-w-${dsl.layout.maxWidth}` 
      : 'max-w-7xl';

    return `${imports.join('\n')}

export default function ${componentName}() {
  return (
    <div className="${layoutClass} mx-auto p-6 space-y-4">
      ${dsl.title ? `<h1 className="text-2xl font-bold mb-4">${dsl.title}</h1>` : ''}
      ${filters.length > 0 ? `<div className="flex gap-4 mb-4">\n${filters.join('\n')}\n      </div>` : ''}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
${columns.join('\n')}
            </TableRow>
          </TableHeader>
          <TableBody>
${rows.join('\n')}
          </TableBody>
        </Table>
      </div>
      ${dsl.pagination ? `<div className="flex justify-center mt-4">
        <p className="text-sm text-muted-foreground">Pagination (${dsl.pagination.pageSize} per page)</p>
      </div>` : ''}
    </div>
  );
}
`;
  }
}
