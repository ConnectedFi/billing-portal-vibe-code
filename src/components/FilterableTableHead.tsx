import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableHead } from '@/components/ui/table';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-5 w-5 p-0 opacity-50 group-hover:opacity-70 hover:opacity-100 ${
                    hasActiveFilter ? 'text-primary' : ''
                  }`}
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
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
                  <Select 
                    value={filterValue} 
                    onValueChange={(value) => {
                      onFilterChange?.(value);
                      setOpen(false);
                    }}
                  >
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
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </TableHead>
  );
};
