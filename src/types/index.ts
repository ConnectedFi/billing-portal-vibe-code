export type TransactionType = 
  | 'product-return' 
  | 'principal-payment' 
  | 'principal-and-interest-payment';

export interface Transaction {
  id: string;
  dealerName: string;
  growerName: string;
  postedAt: Date;
  transactionType: TransactionType;
  amountDrawn: number;
  interestAccrued: number;
  cfiMargin: number;
}

export interface DealerSummary {
  dealerName: string;
  transactionCount: number;
  totalAmountDrawn: number;
  totalInterestAccrued: number;
  totalCfiMargin: number;
  firstTransactionDate: Date;
  lastTransactionDate: Date;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type DatePreset = 'last-week' | 'last-month' | 'custom';
