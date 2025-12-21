/**
 * Data utilities for generators
 */

import type { UiDataSource, MockDataSchema } from "../types";

/**
 * Generate mock data from schema (Milestone 3.1)
 */
export function generateMockData(schema: MockDataSchema, count: number = 1): any[] {
  const results: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const item: any = {};
    
    for (const [key, field] of Object.entries(schema)) {
      switch (field.type) {
        case 'string':
          if (field.generator === 'name') {
            item[key] = `Name ${i + 1}`;
          } else if (field.generator === 'email') {
            item[key] = `user${i + 1}@example.com`;
          } else if (field.generator === 'phone') {
            item[key] = `+1-555-${String(i + 1).padStart(4, '0')}`;
          } else if (field.generator === 'url') {
            item[key] = `https://example.com/${i + 1}`;
          } else if (field.generator === 'lorem') {
            item[key] = `Lorem ipsum dolor sit amet ${i + 1}`;
          } else {
            item[key] = `${key} ${i + 1}`;
          }
          break;
        case 'number':
          if (field.generator === 'number') {
            const min = field.min || 0;
            const max = field.max || 100;
            item[key] = min + Math.floor(Math.random() * (max - min + 1));
          } else {
            item[key] = i + 1;
          }
          break;
        case 'boolean':
          if (field.generator === 'boolean') {
            item[key] = Math.random() > 0.5;
          } else {
            item[key] = true;
          }
          break;
        case 'date':
          if (field.generator === 'date') {
            const date = new Date();
            date.setDate(date.getDate() + i);
            item[key] = date.toISOString().split('T')[0];
          } else {
            item[key] = new Date().toISOString();
          }
          break;
        case 'array':
          if (field.items) {
            item[key] = generateMockData(field.items, field.min || 3);
          } else {
            item[key] = [];
          }
          break;
        case 'object':
          if (field.items) {
            item[key] = generateMockData(field.items, 1)[0];
          } else {
            item[key] = {};
          }
          break;
      }
    }
    
    results.push(item);
  }
  
  return results;
}

/**
 * Resolve data from dataSource (Milestone 3.1)
 */
export function resolveDataSource(dataSource: UiDataSource | undefined, defaultData: any): any {
  if (!dataSource) {
    return defaultData;
  }
  
  switch (dataSource.kind) {
    case 'placeholder':
      return defaultData;
    case 'static':
      return dataSource.data || defaultData;
    case 'http':
      // For generated code, we'll use a placeholder that indicates URL fetching
      return `/* Data from ${dataSource.url} */ ${JSON.stringify(defaultData)}`;
    case 'mock':
      if (dataSource.schema) {
        return generateMockData(dataSource.schema, dataSource.count || 3);
      }
      return defaultData;
    default:
      return defaultData;
  }
}

