import { z } from 'zod';

// Define the transaction type enum
const transactionTypeSchema = z.enum(['product-return', 'principal-payment', 'principal-and-interest-payment']);

// Define aggregate types
const aggregateTypeSchema = z.enum(['sum', 'average', 'count', 'min', 'max']);

// Define the search parameters schema
export const searchParamsSchema = z.object({
  // Tab selection
  tab: z.enum(['transactions', 'dealers']).optional().default('transactions'),
  
  // Date range filters
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  
  // Transaction filters
  dealerFilter: z.string().optional().default(''),
  growerFilter: z.string().optional().default(''),
  typeFilter: z.union([transactionTypeSchema, z.literal('all')]).optional().default('all'),
  
  // Column aggregations (format: "columnId:aggregateType,columnId:aggregateType")
  aggregates: z.string().optional().default(''),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Helper functions to convert between URL params and internal state
export const parseSearchParams = (searchParams: Record<string, unknown>): SearchParams => {
  return searchParamsSchema.parse(searchParams);
};

export const createDateRange = (dateFrom?: string, dateTo?: string) => {
  return {
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined
  };
};

export const formatDateForUrl = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Aggregate types with their display properties
export type AggregateType = z.infer<typeof aggregateTypeSchema>;

export interface AggregateConfig {
  type: AggregateType;
  label: string;
  color: string;
  bgColor: string;
}

export const aggregateConfigs: Record<AggregateType, AggregateConfig> = {
  sum: { type: 'sum', label: 'Sum', color: 'text-green-700', bgColor: 'bg-green-100' },
  average: { type: 'average', label: 'Avg', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  count: { type: 'count', label: 'Count', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  min: { type: 'min', label: 'Min', color: 'text-red-700', bgColor: 'bg-red-100' },
  max: { type: 'max', label: 'Max', color: 'text-purple-700', bgColor: 'bg-purple-100' }
};

// Helper functions for URL aggregate encoding/decoding
export const encodeAggregates = (aggregates: Record<string, AggregateType>): string => {
  return Object.entries(aggregates)
    .map(([columnId, type]) => `${columnId}:${type}`)
    .join(',');
};

export const decodeAggregates = (aggregatesString: string): Record<string, AggregateType> => {
  if (!aggregatesString) return {};
  
  const result: Record<string, AggregateType> = {};
  const pairs = aggregatesString.split(',');
  
  for (const pair of pairs) {
    const [columnId, type] = pair.split(':');
    if (columnId && type && aggregateTypeSchema.safeParse(type).success) {
      result[columnId] = type as AggregateType;
    }
  }
  
  return result;
};

// Calculate aggregate value
export const calculateAggregate = (values: number[], type: AggregateType): number => {
  const validValues = values.filter(v => !isNaN(v) && isFinite(v));
  if (validValues.length === 0) return 0;
  
  switch (type) {
    case 'sum':
      return validValues.reduce((acc, val) => acc + val, 0);
    case 'average':
      return validValues.reduce((acc, val) => acc + val, 0) / validValues.length;
    case 'count':
      return validValues.length;
    case 'min':
      return Math.min(...validValues);
    case 'max':
      return Math.max(...validValues);
    default:
      return 0;
  }
};
