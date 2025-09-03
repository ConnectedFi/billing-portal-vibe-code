import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableHead } from '@/components/ui/table';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { TransactionType } from '../types';

interface FilterableTableHeadProps {
  children: React.ReactNode;
  className?: string;
  filterType?: 'text' | 'select';
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  selectOptions?: { value: string; label: string }[];
  placeholder?: string;
}

export const FilterableTableHead = ({
  children,
  className = '',
  filterType,
  filterValue = '',
  onFilterChange,
  selectOptions,
  placeholder = 'Filter...'
}: FilterableTableHeadProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const hasActiveFilter = filterValue && filterValue !== '' && filterValue !== 'all';

  const handleClearFilter = () => {
    if (onFilterChange) {
      onFilterChange(filterType === 'select' ? 'all' : '');
    }
  };

  return (
    <TableHead className={`${className} relative group`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{children}</span>
        {filterType && (
          <div className="flex items-center gap-1">
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                onClick={handleClearFilter}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`h-5 w-5 p-0 opacity-50 group-hover:opacity-70 hover:opacity-100 ${
                hasActiveFilter ? 'text-primary' : ''
              }`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {showFilter && filterType && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 p-2 bg-background border rounded-md shadow-lg">
          {filterType === 'text' ? (
            <Input
              type="text"
              placeholder={placeholder}
              value={filterValue}
              onChange={(e) => onFilterChange?.(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          ) : (
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </TableHead>
  );
};
