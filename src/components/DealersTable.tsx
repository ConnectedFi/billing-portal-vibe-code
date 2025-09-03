import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo, useState } from 'react';
import type { DealerSummary } from '../types';

interface DealersTableProps {
  dealers: DealerSummary[];
}

export const DealersTable = ({ dealers }: DealersTableProps) => {
  const [dealerFilter, setDealerFilter] = useState('');

  const filteredDealers = useMemo(() => {
    return dealers.filter(dealer => {
      const matchesDealer = dealerFilter === '' || 
        dealer.dealerName.toLowerCase().includes(dealerFilter.toLowerCase());
      
      return matchesDealer;
    });
  }, [dealers, dealerFilter]);

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
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Filter by dealer..."
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dealer Name</TableHead>
              <TableHead className="text-right">Transaction Count</TableHead>
              <TableHead className="text-right">Total Amount Drawn</TableHead>
              <TableHead className="text-right">Total Interest Accrued</TableHead>
              <TableHead className="text-right">Total CFI Margin</TableHead>
              <TableHead>First Transaction</TableHead>
              <TableHead>Last Transaction</TableHead>
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
                  <TableCell className="font-medium">{dealer.dealerName}</TableCell>
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
    </div>
  );
};
