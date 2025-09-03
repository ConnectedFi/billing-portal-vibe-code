import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo, useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { ActiveFilters } from './ActiveFilters';

interface TransactionsTableProps {
  transactions: Transaction[];
  dateRange?: { from: Date; to: Date };
}

export const TransactionsTable = ({ transactions, dateRange }: TransactionsTableProps) => {
  const [dealerFilter, setDealerFilter] = useState('');
  const [growerFilter, setGrowerFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesDealer = dealerFilter === '' || 
        transaction.dealerName.toLowerCase().includes(dealerFilter.toLowerCase());
      const matchesGrower = growerFilter === '' || 
        transaction.growerName.toLowerCase().includes(growerFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.transactionType === typeFilter;
      
      return matchesDealer && matchesGrower && matchesType;
    });
  }, [transactions, dealerFilter, growerFilter, typeFilter]);

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

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Filter by dealer..."
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by grower..."
          value={growerFilter}
          onChange={(e) => setGrowerFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select value={typeFilter} onValueChange={(value: TransactionType | 'all') => setTypeFilter(value)}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="product-return">Product Return</SelectItem>
            <SelectItem value="principal-payment">Principal Payment</SelectItem>
            <SelectItem value="principal-and-interest-payment">Principal & Interest Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Dealer Name</TableHead>
              <TableHead className="font-semibold text-foreground">Grower Name</TableHead>
              <TableHead className="font-semibold text-foreground">Posted Date</TableHead>
              <TableHead className="font-semibold text-foreground">Transaction Type</TableHead>
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
        onClearDealerFilter={() => setDealerFilter('')}
        onClearGrowerFilter={() => setGrowerFilter('')}
        onClearTypeFilter={() => setTypeFilter('all')}
        onClearAllFilters={() => {
          setDealerFilter('');
          setGrowerFilter('');
          setTypeFilter('all');
        }}
      />
    </div>
  );
};
