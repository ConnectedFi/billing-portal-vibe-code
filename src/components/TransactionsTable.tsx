import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Transaction, TransactionType } from '../types';
import { ActiveFilters } from './ActiveFilters';
import { FilterableTableHead } from './FilterableTableHead';

interface TransactionsTableProps {
  transactions: Transaction[];
  dateRange?: { from: Date; to: Date };
  dealerFilter: string;
  growerFilter: string;
  typeFilter: TransactionType | 'all';
  onDealerFilterChange: (filter: string) => void;
  onGrowerFilterChange: (filter: string) => void;
  onTypeFilterChange: (filter: TransactionType | 'all') => void;
}

export const TransactionsTable = ({ 
  transactions, 
  dateRange, 
  dealerFilter, 
  growerFilter, 
  typeFilter,
  onDealerFilterChange,
  onGrowerFilterChange,
  onTypeFilterChange
}: TransactionsTableProps) => {
  // Transactions are already filtered at the route level
  const filteredTransactions = transactions;

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
        onClearAllFilters={() => {
          onDealerFilterChange('');
          onGrowerFilterChange('');
          onTypeFilterChange('all');
        }}
      />
    </div>
  );
};
