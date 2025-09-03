import { z } from 'zod';

// Define the transaction type enum
const transactionTypeSchema = z.enum(['product-return', 'principal-payment', 'principal-and-interest-payment']);

// Define the search parameters schema
export const searchParamsSchema = z.object({
  // Tab selection
  tab: z.enum(['transactions', 'dealers']).optional().default('transactions'),
  
  // Date range filters
  dateFrom: z.string().optional().default('2024-01-01'),
  dateTo: z.string().optional().default('2024-12-31'),
  
  // Transaction filters
  dealerFilter: z.string().optional().default(''),
  growerFilter: z.string().optional().default(''),
  typeFilter: z.union([transactionTypeSchema, z.literal('all')]).optional().default('all'),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Helper functions to convert between URL params and internal state
export const parseSearchParams = (searchParams: Record<string, unknown>): SearchParams => {
  return searchParamsSchema.parse(searchParams);
};

export const createDateRange = (dateFrom: string, dateTo: string) => {
  return {
    from: new Date(dateFrom),
    to: new Date(dateTo)
  };
};

export const formatDateForUrl = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
