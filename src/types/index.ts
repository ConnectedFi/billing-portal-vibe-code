export type TransactionType =
	| "product-return"
	| "principal-payment"
	| "principal-and-interest-payment";

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
	receivableFromCFA: number;
	payableToCFA: number;
}

export interface DateRange {
	from?: Date;
	to?: Date;
}

export interface Dealer {
	id: string;
	name: string;
}

export type Tranche = {
	id: string;
	label: string;
	dealerId: Dealer;
	description: string;
	// Probably move to Tranche
	onBoardDate: Date;
	trancheTerms: TrancheTerm[]
};

export type TrancheTerm = {
	id: string;
	trancheId: string;
	startDate: Date;
	endDate: Date;
	// use decimal to represent percentage: .67 == 67%
	retailerRate: Rate;
	// use decimal to represent percentage: .67 == 67%
	growerRate: Rate;
};

export type DatePreset =
	| "none"
	| "last-week"
	| "last-month"
	| "last-year"
	| "custom";

export type Rate =
	| {
			type: "prime-plus";
			value: number;
	  }
	| {
			type: "fixed";
			rate: number;
	  };
