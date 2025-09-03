import { Badge } from '@/components/ui/badge';
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
import type { Transaction, TransactionType } from '../types';
import { ActiveFilters } from './ActiveFilters';
import { FilterableTableHead } from './FilterableTableHead';
import { TableFooterWithAggregates } from './TableFooterWithAggregates';

interface TransactionsTableProps {
  transactions: Transaction[];
  dateRange?: { from?: Date; to?: Date };
  dealerFilter: string;
  growerFilter: string;
  typeFilter: TransactionType | 'all';
  aggregatesParam: string;
  onDealerFilterChange: (filter: string) => void;
  onGrowerFilterChange: (filter: string) => void;
  onTypeFilterChange: (filter: TransactionType | 'all') => void;
  onClearDateFilter?: () => void;
  onAggregatesChange: (aggregates: string) => void;
}

export const TransactionsTable = ({ 
  transactions, 
  dateRange, 
  dealerFilter, 
  growerFilter, 
  typeFilter,
  aggregatesParam,
  onDealerFilterChange,
  onGrowerFilterChange,
  onTypeFilterChange,
  onClearDateFilter,
  onAggregatesChange
}: TransactionsTableProps) => {
  // Transactions are already filtered at the route level
  const filteredTransactions = transactions;
  
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getTransactionTypeBadge = (type: TransactionType) => {
    const variants = {
      'product-return': 'default',
      'principal-payment': 'secondary',
      'principal-and-interest-payment': 'outline'
    } as const;

    return (
      <Badge variant={variants[type]}>
        {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const transactionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'product-return', label: 'Product Return' },
    { value: 'principal-payment', label: 'Principal Payment' },
    { value: 'principal-and-interest-payment', label: 'Principal & Interest Payment' }
  ];

  // Configure numeric columns with meaningful IDs
  const numericColumns = [
    {
      id: 'amountDrawn',
      index: 4,
      label: 'Amount Drawn',
      data: filteredTransactions.map(t => t.amountDrawn),
      formatValue: formatCurrency
    },
    {
      id: 'interestAccrued',
      index: 5,
      label: 'Interest Accrued',
      data: filteredTransactions.map(t => t.interestAccrued),
      formatValue: formatCurrency
    },
    {
      id: 'cfiMargin',
      index: 6,
      label: 'CFI Margin',
      data: filteredTransactions.map(t => t.cfiMargin),
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
              <FilterableTableHead
                filterType="text"
                filterValue={growerFilter}
                onFilterChange={onGrowerFilterChange}
                placeholder="Filter growers..."
              >
                Grower Name
              </FilterableTableHead>
              <TableHead className="font-semibold text-foreground">Posted Date</TableHead>
              <FilterableTableHead
                filterType="select"
                filterValue={typeFilter}
                onFilterChange={(value: string) => onTypeFilterChange(value as TransactionType | 'all')}
                selectOptions={transactionTypeOptions}
                placeholder="Filter types..."
              >
                Transaction Type
              </FilterableTableHead>
              <TableHead className="text-right font-semibold text-foreground">Amount Drawn</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Interest Accrued</TableHead>
              <TableHead className="text-right font-semibold text-foreground">CFI Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.dealerName}</TableCell>
                  <TableCell>{transaction.growerName}</TableCell>
                  <TableCell>{formatDate(transaction.postedAt)}</TableCell>
                  <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.amountDrawn)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.interestAccrued)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.cfiMargin)}</TableCell>
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
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      <ActiveFilters
        dealerFilter={dealerFilter}
        growerFilter={growerFilter}
        typeFilter={typeFilter}
        dateRange={dateRange}
        onClearDealerFilter={() => onDealerFilterChange('')}
        onClearGrowerFilter={() => onGrowerFilterChange('')}
        onClearTypeFilter={() => onTypeFilterChange('all')}
        onClearDateFilter={onClearDateFilter}
        onClearAllFilters={() => {
          onDealerFilterChange('');
          onGrowerFilterChange('');
          onTypeFilterChange('all');
          onClearDateFilter?.();
        }}
      />
    </div>
  );
};
