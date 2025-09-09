import type { Dealer, Rate, TrancheTerm, TrancheWithDealer } from "../types";

// Mock dealers data
export const mockDealers: Dealer[] = [
	{ id: "1", name: "Green Valley Farms" },
	{ id: "2", name: "Harvest Co" },
	{ id: "3", name: "Sunrise Agriculture" },
	{ id: "4", name: "Prairie Grain Co" },
	{ id: "5", name: "Mountain View Agri" },
];

// Helper function to create date relative to today
const createDate = (daysFromToday: number): Date => {
	const date = new Date();
	date.setDate(date.getDate() + daysFromToday);
	return date;
};

// Mock tranche terms
const mockTrancheTerms: TrancheTerm[] = [
	{
		startDate: createDate(-90), // 90 days ago
		endDate: createDate(180), // 180 days from now
		onBoardDate: createDate(-85), // 85 days ago
		retailerRate: { type: "prime-plus", value: 2.5 },
		growerRate: { type: "fixed", rate: 0.065 }, // 6.5%
	},
	{
		startDate: createDate(-60), // 60 days ago
		endDate: createDate(210), // 210 days from now
		onBoardDate: createDate(-55), // 55 days ago
		retailerRate: { type: "fixed", rate: 0.075 },
		growerRate: { type: "prime-plus", value: 1.8 },
	},
	{
		startDate: createDate(-30), // 30 days ago
		endDate: createDate(240), // 240 days from now
		onBoardDate: createDate(-25), // 25 days ago
		retailerRate: { type: "prime-plus", value: 3.0 },
		growerRate: { type: "fixed", rate: 0.055 }, // 5.5%
	},
];

// Mock tranches data
export const mockTranches: TrancheWithDealer[] = [
	{
		id: "tranche-1",
		label: "Spring 2024 - Series A",
		dealerId: mockDealers[0], // Green Valley Farms
		description: "Primary funding tranche for spring planting season with competitive rates for established growers.",
		trancheTerms: [mockTrancheTerms[0]],
	},
	{
		id: "tranche-2",
		label: "Spring 2024 - Series B",
		dealerId: mockDealers[1], // Harvest Co
		description: "Secondary tranche offering flexible terms for mid-season expansion and equipment financing.",
		trancheTerms: [mockTrancheTerms[1]],
	},
	{
		id: "tranche-3",
		label: "Summer 2024 - Growth",
		dealerId: mockDealers[2], // Sunrise Agriculture
		description: "Growth-focused tranche targeting emerging agricultural markets with variable rate structures.",
		trancheTerms: [mockTrancheTerms[2]],
	},
	{
		id: "tranche-4",
		label: "Q2 2024 - Premium",
		dealerId: mockDealers[3], // Prairie Grain Co
		description: "Premium tier tranche for high-volume dealers with preferential terms and extended payment periods.",
		trancheTerms: [
			{
				startDate: createDate(-45),
				endDate: createDate(300),
				onBoardDate: createDate(-40),
				retailerRate: { type: "prime-plus", value: 1.5 },
				growerRate: { type: "fixed", rate: 0.045 }, // 4.5%
			},
		],
	},
	{
		id: "tranche-5",
		label: "Harvest 2024 - Standard",
		dealerId: mockDealers[4], // Mountain View Agri
		description: "Standard harvest season tranche with balanced terms for seasonal cash flow management.",
		trancheTerms: [
			{
				startDate: createDate(-15),
				endDate: createDate(150),
				onBoardDate: createDate(-10),
				retailerRate: { type: "fixed", rate: 0.08 }, // 8%
				growerRate: { type: "prime-plus", value: 2.0 },
			},
		],
	},
	{
		id: "tranche-6",
		label: "Multi-Term 2024",
		dealerId: mockDealers[0], // Green Valley Farms (multiple tranches)
		description: "Multi-term tranche with staggered payment schedules and varying rate structures for complex financing needs.",
		trancheTerms: [
			{
				startDate: createDate(-120),
				endDate: createDate(90),
				onBoardDate: createDate(-115),
				retailerRate: { type: "fixed", rate: 0.07 },
				growerRate: { type: "fixed", rate: 0.06 },
			},
			{
				startDate: createDate(-60),
				endDate: createDate(180),
				onBoardDate: createDate(-55),
				retailerRate: { type: "prime-plus", value: 2.25 },
				growerRate: { type: "prime-plus", value: 1.75 },
			},
		],
	},
];

// Utility functions for tranche management
export const getTranchesByDealer = (dealerId: string): TrancheWithDealer[] => {
	return mockTranches.filter((tranche) => tranche.dealerId.id === dealerId);
};

export const getAllTranches = (): TrancheWithDealer[] => {
	return mockTranches;
};

export const getTrancheById = (id: string): TrancheWithDealer | undefined => {
	return mockTranches.find((tranche) => tranche.id === id);
};

// Helper function to format rate for display
export const formatRate = (rate: Rate): string => {
	if (rate.type === "fixed") {
		return `${(rate.rate * 100).toFixed(2)}% Fixed`;
	}
	return `Prime + ${rate.value.toFixed(2)}%`;
};

// Helper function to get active tranches (those with current or future terms)
export const getActiveTranches = (): TrancheWithDealer[] => {
	const today = new Date();
	return mockTranches.filter((tranche) =>
		tranche.trancheTerms.some((term) => term.endDate >= today),
	);
};

// Helper function to get tranches by status
export const getTranchesByStatus = (status: "active" | "expired" | "upcoming"): TrancheWithDealer[] => {
	const today = new Date();
	
	return mockTranches.filter((tranche) => {
		const hasActiveTerm = tranche.trancheTerms.some(
			(term) => term.startDate <= today && term.endDate >= today,
		);
		const hasExpiredTerm = tranche.trancheTerms.some((term) => term.endDate < today);
		const hasUpcomingTerm = tranche.trancheTerms.some((term) => term.startDate > today);

		switch (status) {
			case "active":
				return hasActiveTerm;
			case "expired":
				return hasExpiredTerm && !hasActiveTerm && !hasUpcomingTerm;
			case "upcoming":
				return hasUpcomingTerm && !hasActiveTerm;
			default:
				return false;
		}
	});
};
