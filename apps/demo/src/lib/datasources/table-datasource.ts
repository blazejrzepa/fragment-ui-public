/**
 * Table Data Source
 * 
 * Generates realistic table data with pagination support
 */

export interface TableRow {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  date: string;
  action: string;
  [key: string]: string | number;
}

export interface TableData {
  rows: TableRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Generate realistic table data
 */
export function generateTableData(page: number = 1, pageSize: number = 10): TableData {
  const total = 150; // Total records
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  
  const statuses: Array<"active" | "inactive" | "pending"> = ["active", "inactive", "pending"];
  const actions = ["View", "Edit", "Delete", "Archive"];
  const names = [
    "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown",
    "Diana Prince", "Eve Adams", "Frank Miller", "Grace Lee", "Henry Davis",
    "Ivy Chen", "Jack Wilson", "Kate Martinez", "Liam O'Brien", "Mia Garcia",
  ];

  const rows: TableRow[] = Array.from({ length: Math.min(pageSize, total - startIndex) }, (_, i) => {
    const index = startIndex + i;
    const name = names[index % names.length];
    const status = statuses[index % statuses.length];
    const action = actions[index % actions.length];
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      id: `ID-${String(index + 1).padStart(4, '0')}`,
      name,
      status,
      date,
      action,
    };
  });

  return {
    rows,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Mock API function for table data
 * In production, this would fetch from a real API with pagination
 */
export async function fetchTableData(
  page: number = 1,
  pageSize: number = 10,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  filters?: Record<string, any>
): Promise<TableData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let data = generateTableData(page, pageSize);
  
  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status !== "All") {
      data.rows = data.rows.filter(row => row.status === filters.status.toLowerCase());
    }
    if (filters.category && filters.category !== "All") {
      // Filter by category if needed
    }
  }
  
  // Apply sorting if provided
  if (sortBy) {
    data.rows.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }
  
  return data;
}

