import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { DealersTable } from '../components/DealersTable';
import { TransactionsTable } from '../components/TransactionsTable';
import { 
  aggregateTransactionsByDealer,
  filterTransactionsByDateRange,
  getLastMonthRange,
  mockTransactions 
} from '../data/mockData';
import type { DateRange } from '../types';

export const Route = createFileRoute('/dealers-transactions')({
  component: DealersTransactionsPage,
});

function DealersTransactionsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'dealers'>('transactions');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date('2024-01-01'),
    to: new Date('2024-12-31')
  });

  const handleClearDateFilter = () => {
    setDateRange({
      from: new Date('2024-01-01'),
      to: new Date('2024-12-31')
    });
  };

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByDateRange(mockTransactions, dateRange);
  }, [dateRange]);

  const dealerSummaries = useMemo(() => {
    return aggregateTransactionsByDealer(filteredTransactions);
  }, [filteredTransactions]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dealers & Transactions</h1>
      </div>

      <DateRangeSelector 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'transactions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions ({filteredTransactions.length})
        </Button>
        <Button
          variant={activeTab === 'dealers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dealers')}
        >
          Dealers ({dealerSummaries.length})
        </Button>
      </div>

      {activeTab === 'transactions' ? (
        <Card>
          <CardHeader>
            <CardTitle>Individual Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable 
              transactions={filteredTransactions} 
              dateRange={dateRange}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dealer Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <DealersTable 
              dealers={dealerSummaries} 
              dateRange={dateRange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
