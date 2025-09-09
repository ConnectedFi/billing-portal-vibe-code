import type { Dealer, Rate, Tranche, TrancheTerm } from "../types";

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

// Helper function to create a tranche term with proper IDs
const createTrancheTerm = (
	id: string,
	trancheId: string,
	startDays: number,
	endDays: number,
	onBoardDays: number,
	retailerRate: Rate,
	growerRate: Rate
): TrancheTerm => ({
	id,
	trancheId,
	startDate: createDate(startDays),
	endDate: createDate(endDays),
	onBoardDate: createDate(onBoardDays),
	retailerRate,
	growerRate,
});

// Mock tranches data
export const mockTranches: Tranche[] = [
	{
		id: "tranche-1",
		label: "Spring 2024 - Series A",
		dealerId: mockDealers[0], // Green Valley Farms
		description: "Primary funding tranche for spring planting season with competitive rates for established growers.",
		trancheTerms: [
			createTrancheTerm(
				"term-1",
				"tranche-1",
				-90, 180, -85,
				{ type: "prime-plus", value: 2.5 },
				{ type: "fixed", rate: 0.065 }
			),
		],
	},
	{
		id: "tranche-2",
		label: "Spring 2024 - Series B",
		dealerId: mockDealers[1], // Harvest Co
		description: "Secondary tranche offering flexible terms for mid-season expansion and equipment financing.",
		trancheTerms: [
			createTrancheTerm(
				"term-2",
				"tranche-2",
				-60, 210, -55,
				{ type: "fixed", rate: 0.075 },
				{ type: "prime-plus", value: 1.8 }
			),
		],
	},
	{
		id: "tranche-3",
		label: "Summer 2024 - Growth",
		dealerId: mockDealers[2], // Sunrise Agriculture
		description: "Growth-focused tranche targeting emerging agricultural markets with variable rate structures.",
		trancheTerms: [
			createTrancheTerm(
				"term-3",
				"tranche-3",
				-30, 240, -25,
				{ type: "prime-plus", value: 3.0 },
				{ type: "fixed", rate: 0.055 }
			),
		],
	},
	{
		id: "tranche-4",
		label: "Q2 2024 - Premium",
		dealerId: mockDealers[3], // Prairie Grain Co
		description: "Premium tier tranche for high-volume dealers with preferential terms and extended payment periods.",
		trancheTerms: [
			createTrancheTerm(
				"term-4",
				"tranche-4",
				-45, 300, -40,
				{ type: "prime-plus", value: 1.5 },
				{ type: "fixed", rate: 0.045 }
			),
		],
	},
	{
		id: "tranche-5",
		label: "Harvest 2024 - Standard",
		dealerId: mockDealers[4], // Mountain View Agri
		description: "Standard harvest season tranche with balanced terms for seasonal cash flow management.",
		trancheTerms: [
			createTrancheTerm(
				"term-5",
				"tranche-5",
				-15, 150, -10,
				{ type: "fixed", rate: 0.08 },
				{ type: "prime-plus", value: 2.0 }
			),
		],
	},
	{
		id: "tranche-6",
		label: "Multi-Term 2024",
		dealerId: mockDealers[0], // Green Valley Farms (multiple tranches)
		description: "Multi-term tranche with staggered payment schedules and varying rate structures for complex financing needs.",
		trancheTerms: [
			createTrancheTerm(
				"term-6a",
				"tranche-6",
				-120, 90, -115,
				{ type: "fixed", rate: 0.07 },
				{ type: "fixed", rate: 0.06 }
			),
			createTrancheTerm(
				"term-6b",
				"tranche-6",
				-60, 180, -55,
				{ type: "prime-plus", value: 2.25 },
				{ type: "prime-plus", value: 1.75 }
			),
		],
	},
];

// Utility functions for tranche management
export const getTranchesByDealer = (dealerId: string): Tranche[] => {
	return mockTranches.filter((tranche) => tranche.dealerId.id === dealerId);
};

export const getAllTranches = (): Tranche[] => {
	return mockTranches;
};

export const getTrancheById = (id: string): Tranche | undefined => {
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
export const getActiveTranches = (): Tranche[] => {
	const today = new Date();
	return mockTranches.filter((tranche) =>
		tranche.trancheTerms.some((term) => term.endDate >= today),
	);
};

// Helper function to get tranches by status
export const getTranchesByStatus = (status: "active" | "expired" | "upcoming"): Tranche[] => {
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

// Utility functions for tranche terms
export const getAllTrancheTerms = (): TrancheTerm[] => {
	return mockTranches.flatMap((tranche) => tranche.trancheTerms);
};

export const getTrancheTermsByTrancheId = (trancheId: string): TrancheTerm[] => {
	const tranche = mockTranches.find((t) => t.id === trancheId);
	return tranche ? tranche.trancheTerms : [];
};

export const getTrancheTermById = (termId: string): TrancheTerm | undefined => {
	return getAllTrancheTerms().find((term) => term.id === termId);
};

// Helper function to get tranche name by ID (for display purposes)
export const getTrancheNameById = (trancheId: string): string => {
	const tranche = mockTranches.find((t) => t.id === trancheId);
	return tranche ? tranche.label : "Unknown Tranche";
};
