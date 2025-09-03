import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { DateRange, TransactionType } from '../types';

interface FilterItem {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  dealerFilter?: string;
  growerFilter?: string;
  typeFilter?: TransactionType | 'all';
  dateRange?: DateRange;
  onClearDealerFilter?: () => void;
  onClearGrowerFilter?: () => void;
  onClearTypeFilter?: () => void;
  onClearDateFilter?: () => void;
  onClearAllFilters?: () => void;
}

export const ActiveFilters = ({
  dealerFilter,
  growerFilter,
  typeFilter,
  dateRange,
  onClearDealerFilter,
  onClearGrowerFilter,
  onClearTypeFilter,
  onClearDateFilter,
  onClearAllFilters
}: ActiveFiltersProps) => {
  const filters: FilterItem[] = [];

  // Add dealer filter
  if (dealerFilter && dealerFilter.trim() !== '') {
    filters.push({
      key: 'dealer',
      label: 'Dealer',
      value: dealerFilter,
      onRemove: onClearDealerFilter || (() => {})
    });
  }

  // Add grower filter
  if (growerFilter && growerFilter.trim() !== '') {
    filters.push({
      key: 'grower',
      label: 'Grower',
      value: growerFilter,
      onRemove: onClearGrowerFilter || (() => {})
    });
  }

  // Add transaction type filter
  if (typeFilter && typeFilter !== 'all') {
    const typeLabels = {
      'product-return': 'Product Return',
      'principal-payment': 'Principal Payment',
      'principal-and-interest-payment': 'Principal & Interest Payment'
    };
    
    filters.push({
      key: 'type',
      label: 'Type',
      value: typeLabels[typeFilter],
      onRemove: onClearTypeFilter || (() => {})
    });
  }

  // Add date range filter
  if (dateRange) {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    };

    const today = new Date();
    const isDefaultRange = dateRange.from.getFullYear() === 2024 && 
                          dateRange.to.getFullYear() === 2024 &&
                          dateRange.from.getMonth() === 0 && 
                          dateRange.from.getDate() === 1 &&
                          dateRange.to.getMonth() === 11 &&
                          dateRange.to.getDate() === 31;

    if (!isDefaultRange) {
      filters.push({
        key: 'dateRange',
        label: 'Date Range',
        value: `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`,
        onRemove: onClearDateFilter || (() => {})
      });
    }
  }

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={filter.onRemove}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      {filters.length > 1 && onClearAllFilters && (
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onClearAllFilters}
        >
          Clear All
        </Button>
      )}
    </div>
  );
};
