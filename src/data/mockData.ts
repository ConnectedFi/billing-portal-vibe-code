import type { DealerSummary, Transaction } from '../types';

// Generate mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    dealerName: 'Green Valley Farms',
    growerName: 'John Smith',
    postedAt: new Date('2024-01-15'),
    transactionType: 'principal-payment',
    amountDrawn: 50000,
    interestAccrued: 2500,
    cfiMargin: 1250
  },
  {
    id: '2',
    dealerName: 'Green Valley Farms',
    growerName: 'Jane Doe',
    postedAt: new Date('2024-01-20'),
    transactionType: 'product-return',
    amountDrawn: 25000,
    interestAccrued: 1200,
    cfiMargin: 600
  },
  {
    id: '3',
    dealerName: 'Harvest Co',
    growerName: 'Bob Johnson',
    postedAt: new Date('2024-01-10'),
    transactionType: 'principal-and-interest-payment',
    amountDrawn: 75000,
    interestAccrued: 3750,
    cfiMargin: 1875
  },
  {
    id: '4',
    dealerName: 'Harvest Co',
    growerName: 'Alice Brown',
    postedAt: new Date('2024-01-25'),
    transactionType: 'product-return',
    amountDrawn: 30000,
    interestAccrued: 1500,
    cfiMargin: 750
  },
  {
    id: '5',
    dealerName: 'Sunrise Agriculture',
    growerName: 'Mike Wilson',
    postedAt: new Date('2024-01-05'),
    transactionType: 'principal-payment',
    amountDrawn: 40000,
    interestAccrued: 2000,
    cfiMargin: 1000
  },
  {
    id: '6',
    dealerName: 'Green Valley Farms',
    growerName: 'Sarah Davis',
    postedAt: new Date('2024-02-01'),
    transactionType: 'principal-and-interest-payment',
    amountDrawn: 60000,
    interestAccrued: 3000,
    cfiMargin: 1500
  },
  {
    id: '7',
    dealerName: 'Harvest Co',
    growerName: 'Tom Miller',
    postedAt: new Date('2024-02-10'),
    transactionType: 'product-return',
    amountDrawn: 35000,
    interestAccrued: 1750,
    cfiMargin: 875
  },
  {
    id: '8',
    dealerName: 'Sunrise Agriculture',
    growerName: 'Lisa Garcia',
    postedAt: new Date('2024-02-15'),
    transactionType: 'principal-payment',
    amountDrawn: 45000,
    interestAccrued: 2250,
    cfiMargin: 1125
  }
];

// Function to aggregate transactions by dealer
export const aggregateTransactionsByDealer = (transactions: Transaction[]): DealerSummary[] => {
  const dealerMap = new Map<string, DealerSummary>();

  for (const transaction of transactions) {
    const existing = dealerMap.get(transaction.dealerName);
    
    if (existing) {
      existing.transactionCount += 1;
      existing.totalAmountDrawn += transaction.amountDrawn;
      existing.totalInterestAccrued += transaction.interestAccrued;
      existing.totalCfiMargin += transaction.cfiMargin;
      existing.firstTransactionDate = new Date(Math.min(
        existing.firstTransactionDate.getTime(),
        transaction.postedAt.getTime()
      ));
      existing.lastTransactionDate = new Date(Math.max(
        existing.lastTransactionDate.getTime(),
        transaction.postedAt.getTime()
      ));
    } else {
      dealerMap.set(transaction.dealerName, {
        dealerName: transaction.dealerName,
        transactionCount: 1,
        totalAmountDrawn: transaction.amountDrawn,
        totalInterestAccrued: transaction.interestAccrued,
        totalCfiMargin: transaction.cfiMargin,
        firstTransactionDate: new Date(transaction.postedAt),
        lastTransactionDate: new Date(transaction.postedAt)
      });
    }
  }

  return Array.from(dealerMap.values());
};

// Utility functions for date filtering
export const getLastWeekRange = (): { from: Date; to: Date } => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return { from, to };
};

export const getLastMonthRange = (): { from: Date; to: Date } => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  return { from, to };
};

export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  dateRange: { from: Date; to: Date }
): Transaction[] => {
  return transactions.filter(transaction => 
    transaction.postedAt >= dateRange.from && transaction.postedAt <= dateRange.to
  );
};
