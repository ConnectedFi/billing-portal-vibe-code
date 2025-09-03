import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { type AggregateType, decodeAggregates, encodeAggregates } from '../lib/searchParams';
import type { DealerSummary } from '../types';
import { ActiveFilters } from './ActiveFilters';
import { FilterableTableHead } from './FilterableTableHead';
import { TableFooterWithAggregates } from './TableFooterWithAggregates';

interface DealersTableProps {
  dealers: DealerSummary[];
  dateRange?: { from?: Date; to?: Date };
  dealerFilter: string;
  aggregatesParam: string;
  onDealerFilterChange: (filter: string) => void;
  onDealerClick?: (dealerName: string) => void;
  onClearDateFilter?: () => void;
  onAggregatesChange: (aggregates: string) => void;
}

export const DealersTable = ({ dealers, dateRange, dealerFilter, aggregatesParam, onDealerFilterChange, onDealerClick, onClearDateFilter, onAggregatesChange }: DealersTableProps) => {
  // Dealers are already filtered at the route level
  const filteredDealers = dealers;
  
  // Decode current aggregates from URL
  const activeAggregates = decodeAggregates(aggregatesParam);
  
  // Handle aggregate changes
  const handleAggregateChange = (columnId: string, aggregateType: AggregateType | null) => {
    const newAggregates = { ...activeAggregates };
    
    if (aggregateType) {
      newAggregates[columnId] = aggregateType;
    } else {
      delete newAggregates[columnId];
    }
    
    onAggregatesChange(encodeAggregates(newAggregates));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Configure numeric columns with meaningful IDs
  const numericColumns = [
    {
      id: 'transactionCount',
      index: 1,
      label: 'Transaction Count',
      data: filteredDealers.map(d => d.transactionCount),
      formatValue: (v: number) => v.toString()
    },
    {
      id: 'totalAmountDrawn',
      index: 2,
      label: 'Total Amount Drawn',
      data: filteredDealers.map(d => d.totalAmountDrawn),
      formatValue: formatCurrency
    },
    {
      id: 'totalInterestAccrued',
      index: 3,
      label: 'Total Interest Accrued',
      data: filteredDealers.map(d => d.totalInterestAccrued),
      formatValue: formatCurrency
    },
    {
      id: 'totalCfiMargin',
      index: 4,
      label: 'Total CFI Margin',
      data: filteredDealers.map(d => d.totalCfiMargin),
      formatValue: formatCurrency
    },
    {
      id: 'receivableFromCFA',
      index: 5,
      label: 'Receivable from CFA',
      data: filteredDealers.map(d => d.receivableFromCFA),
      formatValue: formatCurrency
    },
    {
      id: 'payableToCFA',
      index: 6,
      label: 'Payable to CFA',
      data: filteredDealers.map(d => d.payableToCFA),
      formatValue: formatCurrency
    }
  ];



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
              <TableHead className="text-right font-semibold text-foreground">Receivable from CFA</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Payable to CFA</TableHead>
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
                  <TableCell className="text-right">{formatCurrency(dealer.receivableFromCFA)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(dealer.payableToCFA)}</TableCell>
                </TableRow>
              ))
            )}
                     </TableBody>
           <TableFooter>
             <TableFooterWithAggregates
               columns={numericColumns}
               totalColumns={7}
               activeAggregates={activeAggregates}
               onAggregateChange={handleAggregateChange}
             />
           </TableFooter>
         </Table>
       </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredDealers.length} of {dealers.length} dealers
      </div>

      <ActiveFilters
        dealerFilter={dealerFilter}
        dateRange={dateRange}
        onClearDealerFilter={() => onDealerFilterChange('')}
        onClearDateFilter={onClearDateFilter}
        onClearAllFilters={() => {
          onDealerFilterChange('');
          onClearDateFilter?.();
        }}
      />
    </div>
  );
};
