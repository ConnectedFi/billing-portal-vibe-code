import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { DateRangeSelector } from "../components/DateRangeSelector";
import { DealersTable } from "../components/DealersTable";
import { TransactionsTable } from "../components/TransactionsTable";
import {
	aggregateTransactionsByDealer,
	filterTransactionsByDateRange,
	mockTransactions,
} from "../data/mockData";
import {
	type SearchParams,
	createDateRange,
	formatDateForUrl,
	searchParamsSchema,
} from "../lib/searchParams";
import type { TransactionType } from "../types";

export const Route = createFileRoute("/dealers-transactions")({
	validateSearch: searchParamsSchema,
	component: DealersTransactionsPage,
});

function DealersTransactionsPage() {
	const navigate = useNavigate({ from: "/dealers-transactions" });
	const search = Route.useSearch();

	// Convert search params to internal state
	const activeTab = search.tab;
	const dateRange = createDateRange(search.dateFrom, search.dateTo);
	const dealerFilter = search.dealerFilter;
	const growerFilter = search.growerFilter;
	const typeFilter = search.typeFilter;
	const aggregatesParam = search.aggregates;

	// Navigation helpers
	const updateSearch = (updates: Partial<SearchParams>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
			replace: true,
		});
	};

	const setActiveTab = (tab: "transactions" | "dealers") => {
		updateSearch({ tab });
	};

	const setDateRange = (range: { from?: Date; to?: Date }) => {
		updateSearch({
			dateFrom: range.from ? formatDateForUrl(range.from) : undefined,
			dateTo: range.to ? formatDateForUrl(range.to) : undefined,
		});
	};

	const clearDateRange = () => {
		updateSearch({
			dateFrom: undefined,
			dateTo: undefined,
		});
	};

	const setDealerFilter = (filter: string) => {
		updateSearch({ dealerFilter: filter });
	};

	const setGrowerFilter = (filter: string) => {
		updateSearch({ growerFilter: filter });
	};

	const setTypeFilter = (filter: TransactionType | "all") => {
		updateSearch({ typeFilter: filter });
	};

	const setAggregates = (aggregates: string) => {
		updateSearch({ aggregates });
	};

	const handleDealerClick = (dealerName: string) => {
		updateSearch({
			tab: "transactions",
			dealerFilter: dealerName,
			growerFilter: "",
			typeFilter: "all",
		});
	};

	const filteredTransactions = useMemo(() => {
		// First filter by date range
		const dateFiltered = filterTransactionsByDateRange(
			mockTransactions,
			dateRange,
		);

		// Then apply other filters
		return dateFiltered.filter((transaction) => {
			const matchesDealer =
				dealerFilter === "" ||
				transaction.dealerName
					.toLowerCase()
					.includes(dealerFilter.toLowerCase());
			const matchesGrower =
				growerFilter === "" ||
				transaction.growerName
					.toLowerCase()
					.includes(growerFilter.toLowerCase());
			const matchesType =
				typeFilter === "all" || transaction.transactionType === typeFilter;

			return matchesDealer && matchesGrower && matchesType;
		});
	}, [dateRange, dealerFilter, growerFilter, typeFilter]);

	const dealerSummaries = useMemo(() => {
		// For dealers table, only filter by date and dealer name
		const dateFiltered = filterTransactionsByDateRange(
			mockTransactions,
			dateRange,
		);
		const dealerFiltered =
			dealerFilter === ""
				? dateFiltered
				: dateFiltered.filter((transaction) =>
						transaction.dealerName
							.toLowerCase()
							.includes(dealerFilter.toLowerCase()),
					);
		return aggregateTransactionsByDealer(dealerFiltered);
	}, [dateRange, dealerFilter]);

	return (
		<div className="container mx-auto py-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-semibold">Dealers & Transactions</h1>
			</div>

			<DateRangeSelector
				dateRange={dateRange}
				onDateRangeChange={setDateRange}
				onClearDateRange={clearDateRange}
			/>

			<div className="flex gap-2">
				<Button
					variant={activeTab === "transactions" ? "default" : "outline"}
					onClick={() => setActiveTab("transactions")}
				>
					Transactions ({filteredTransactions.length})
				</Button>
				<Button
					variant={activeTab === "dealers" ? "default" : "outline"}
					onClick={() => setActiveTab("dealers")}
				>
					Dealers ({dealerSummaries.length})
				</Button>
			</div>

			{activeTab === "transactions" ? (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Individual Transactions</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<TransactionsTable
							transactions={filteredTransactions}
							dateRange={dateRange.from || dateRange.to ? dateRange : undefined}
							dealerFilter={dealerFilter}
							growerFilter={growerFilter}
							typeFilter={typeFilter}
							aggregatesParam={aggregatesParam}
							onDealerFilterChange={setDealerFilter}
							onGrowerFilterChange={setGrowerFilter}
							onTypeFilterChange={setTypeFilter}
							onClearDateFilter={clearDateRange}
							onAggregatesChange={setAggregates}
						/>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Dealer Summaries</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<DealersTable
							dealers={dealerSummaries}
							dateRange={dateRange.from || dateRange.to ? dateRange : undefined}
							dealerFilter={dealerFilter}
							aggregatesParam={aggregatesParam}
							onDealerFilterChange={setDealerFilter}
							onDealerClick={handleDealerClick}
							onClearDateFilter={clearDateRange}
							onAggregatesChange={setAggregates}
						/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
