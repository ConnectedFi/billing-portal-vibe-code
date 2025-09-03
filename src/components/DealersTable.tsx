import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo } from 'react';
import type { DealerSummary } from '../types';
import { ActiveFilters } from './ActiveFilters';
import { FilterableTableHead } from './FilterableTableHead';

interface DealersTableProps {
  dealers: DealerSummary[];
  dateRange?: { from: Date; to: Date };
  dealerFilter: string;
  onDealerFilterChange: (filter: string) => void;
  onDealerClick?: (dealerName: string) => void;
}

export const DealersTable = ({ dealers, dateRange, dealerFilter, onDealerFilterChange, onDealerClick }: DealersTableProps) => {
  // Dealers are already filtered at the route level
  const filteredDealers = dealers;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <FilterableTableHead
                filterType="text"
                filterValue={dealerFilter}
                onFilterChange={onDealerFilterChange}
                placeholder="Filter dealers..."
              >
                Dealer Name
              </FilterableTableHead>
              <TableHead className="text-right font-semibold text-foreground">Transaction Count</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Total Amount Drawn</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Total Interest Accrued</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Total CFI Margin</TableHead>
              <TableHead className="font-semibold text-foreground">First Transaction</TableHead>
              <TableHead className="font-semibold text-foreground">Last Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDealers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No dealers found
                </TableCell>
              </TableRow>
            ) : (
              filteredDealers.map((dealer) => (
                <TableRow key={dealer.dealerName}>
                  <TableCell className="font-medium">
                    {onDealerClick ? (
                      <button
                        type="button"
                        onClick={() => onDealerClick(dealer.dealerName)}
                        className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium"
                      >
                        {dealer.dealerName}
                      </button>
                    ) : (
                      dealer.dealerName
                    )}
                  </TableCell>
                  <TableCell className="text-right">{dealer.transactionCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(dealer.totalAmountDrawn)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(dealer.totalInterestAccrued)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(dealer.totalCfiMargin)}</TableCell>
                  <TableCell>{formatDate(dealer.firstTransactionDate)}</TableCell>
                  <TableCell>{formatDate(dealer.lastTransactionDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredDealers.length} of {dealers.length} dealers
      </div>

      <ActiveFilters
        dealerFilter={dealerFilter}
        dateRange={dateRange}
        onClearDealerFilter={() => onDealerFilterChange('')}
        onClearAllFilters={() => {
          onDealerFilterChange('');
        }}
      />
    </div>
  );
};
