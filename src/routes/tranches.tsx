import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { TrancheTermsTable } from "../components/TrancheTermsTable";
import { TranchesTable } from "../components/TranchesTable";
import { getAllTrancheTerms, getTrancheNameById, mockTranches } from "../data/mockTranches";
import type { Tranche, TrancheTerm } from "../types";

// Search params schema for tranches page
const tranchesSearchSchema = z.object({
	tab: z.enum(["tranches", "terms"]).optional().default("tranches"),
	dealerFilter: z.string().optional().default(""),
	labelFilter: z.string().optional().default(""),
	trancheFilter: z.string().optional().default(""), // For filtering terms by tranche
	status: z.enum(["all", "active", "expired", "upcoming"]).optional().default("all"),
});

type TranchesSearchParams = z.infer<typeof tranchesSearchSchema>;

export const Route = createFileRoute("/tranches")({
	validateSearch: tranchesSearchSchema,
	component: TranchesPage,
});

function TranchesPage() {
	const navigate = useNavigate({ from: "/tranches" });
	const search = Route.useSearch();

	// Convert search params to internal state
	const activeTab = search.tab;
	const dealerFilter = search.dealerFilter;
	const labelFilter = search.labelFilter;
	const trancheFilter = search.trancheFilter;
	const statusFilter = search.status;

	// Local state for edit modals
	const [editingTranche, setEditingTranche] = useState<Tranche | null>(null);
	const [editingTerm, setEditingTerm] = useState<TrancheTerm | null>(null);

	// Navigation helpers
	const updateSearch = (updates: Partial<TranchesSearchParams>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
			replace: true,
		});
	};

	const setDealerFilter = (filter: string) => {
		updateSearch({ dealerFilter: filter });
	};

	const setLabelFilter = (filter: string) => {
		updateSearch({ labelFilter: filter });
	};

	const setTrancheFilter = (filter: string) => {
		updateSearch({ trancheFilter: filter });
	};

	const setStatusFilter = (status: "all" | "active" | "expired" | "upcoming") => {
		updateSearch({ status });
	};

	const setActiveTab = (tab: "tranches" | "terms") => {
		updateSearch({ tab });
	};

	// Filter tranches based on filters
	const filteredTranches = useMemo(() => {
		let filtered = mockTranches;

		// Filter by dealer name
		if (dealerFilter) {
			filtered = filtered.filter((tranche) =>
				tranche.dealerId.name.toLowerCase().includes(dealerFilter.toLowerCase())
			);
		}

		// Filter by label
		if (labelFilter) {
			filtered = filtered.filter((tranche) =>
				tranche.label.toLowerCase().includes(labelFilter.toLowerCase())
			);
		}

		// Filter by status
		if (statusFilter !== "all") {
			const today = new Date();
			filtered = filtered.filter((tranche) => {
				const hasActiveTerm = tranche.trancheTerms.some(
					(term) => term.startDate <= today && term.endDate >= today,
				);
				const hasExpiredTerm = tranche.trancheTerms.some((term) => term.endDate < today);
				const hasUpcomingTerm = tranche.trancheTerms.some((term) => term.startDate > today);

				switch (statusFilter) {
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
		}

		return filtered;
	}, [dealerFilter, labelFilter, statusFilter]);

	// Filter terms based on filters
	const filteredTerms = useMemo(() => {
		let filtered = getAllTrancheTerms();

		// Filter by tranche name/label
		if (trancheFilter) {
			filtered = filtered.filter((term) => {
				const trancheName = getTrancheNameById(term.trancheId);
				return trancheName.toLowerCase().includes(trancheFilter.toLowerCase());
			});
		}

		// Filter by status
		if (statusFilter !== "all") {
			const today = new Date();
			filtered = filtered.filter((term) => {
				const isActive = term.startDate <= today && term.endDate >= today;
				const isExpired = term.endDate < today;
				const isUpcoming = term.startDate > today;

				switch (statusFilter) {
					case "active":
						return isActive;
					case "expired":
						return isExpired;
					case "upcoming":
						return isUpcoming;
					default:
						return false;
				}
			});
		}

		return filtered;
	}, [trancheFilter, statusFilter]);

	// Handle tranche actions
	const handleCreateTranche = () => {
		toast.info("Create new tranche functionality coming soon!");
	};

	const handleEditTranche = (tranche: Tranche) => {
		setEditingTranche(tranche);
		toast.info(`Opening edit form for: ${tranche.label}`);
	};

	const handleViewTranche = (tranche: Tranche) => {
		toast.info(`Viewing details for: ${tranche.label}`);
	};

	const handleDeleteTranche = (tranche: Tranche) => {
		toast.error(`Delete tranche: ${tranche.label} (confirmation dialog would appear here)`);
	};

	// Handle term actions
	const handleEditTerm = (term: TrancheTerm) => {
		setEditingTerm(term);
		toast.info(`Opening edit form for term: ${term.id}`);
	};

	const handleViewTerm = (term: TrancheTerm) => {
		toast.info(`Viewing details for term: ${term.id}`);
	};

	const handleDeleteTerm = (term: TrancheTerm) => {
		toast.error(`Delete term: ${term.id} (confirmation dialog would appear here)`);
	};

	// Handle clicking on terms count to switch to terms tab and filter
	const handleTrancheTermsClick = (tranche: Tranche) => {
		updateSearch({
			tab: "terms",
			trancheFilter: tranche.label, // Filter by tranche name
			dealerFilter: "", // Clear dealer filter when switching
			labelFilter: "", // Clear label filter when switching
		});
	};

	const statusOptions = [
		{ value: "all", label: "All Statuses" },
		{ value: "active", label: "Active" },
		{ value: "upcoming", label: "Upcoming" },
		{ value: "expired", label: "Expired" },
	];

	return (
		<div className="container mx-auto py-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-semibold">Tranche Management</h1>
				<Button onClick={handleCreateTranche}>
					Create New Tranche
				</Button>
			</div>

			{/* Tab Navigation */}
			<div className="flex gap-2">
				<Button
					variant={activeTab === "tranches" ? "default" : "outline"}
					onClick={() => setActiveTab("tranches")}
				>
					Tranches ({filteredTranches.length})
				</Button>
				<Button
					variant={activeTab === "terms" ? "default" : "outline"}
					onClick={() => setActiveTab("terms")}
				>
					Terms ({filteredTerms.length})
				</Button>
			</div>

			{/* Tranches Table */}
			{activeTab === "tranches" ? (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Tranches</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<TranchesTable 
							tranches={filteredTranches}
							dealerFilter={dealerFilter}
							labelFilter={labelFilter}
							statusFilter={statusFilter}
							statusOptions={statusOptions}
							onDealerFilterChange={setDealerFilter}
							onLabelFilterChange={setLabelFilter}
							onStatusFilterChange={setStatusFilter}
							onEdit={handleEditTranche}
							onView={handleViewTranche}
							onDelete={handleDeleteTranche}
							onTermsClick={handleTrancheTermsClick}
							onClearFilters={() => {
								setDealerFilter("");
								setLabelFilter("");
								setStatusFilter("all");
							}}
						/>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Tranche Terms</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<TrancheTermsTable 
							terms={filteredTerms}
							trancheFilter={trancheFilter}
							statusFilter={statusFilter}
							statusOptions={statusOptions}
							onTrancheFilterChange={setTrancheFilter}
							onStatusFilterChange={setStatusFilter}
							onEdit={handleEditTerm}
							onView={handleViewTerm}
							onDelete={handleDeleteTerm}
							onClearFilters={() => {
								setTrancheFilter("");
								setStatusFilter("all");
							}}
						/>
					</CardContent>
				</Card>
			)}

			{/* Edit Modals */}
			{editingTranche && (
				<EditTrancheModal 
					tranche={editingTranche}
					onClose={() => setEditingTranche(null)}
					onSave={(updatedTranche) => {
						toast.success(`Saved changes to: ${updatedTranche.label}`);
						setEditingTranche(null);
					}}
				/>
			)}

			{editingTerm && (
				<EditTermModal 
					term={editingTerm}
					onClose={() => setEditingTerm(null)}
					onSave={(updatedTerm) => {
						toast.success(`Saved changes to term: ${updatedTerm.id}`);
						setEditingTerm(null);
					}}
				/>
			)}
		</div>
	);
}

// Simple edit modal component (placeholder for now)
function EditTrancheModal({ 
	tranche, 
	onClose, 
	onSave 
}: { 
	tranche: Tranche;
	onClose: () => void;
	onSave: (tranche: Tranche) => void;
}) {
	const [label, setLabel] = useState(tranche.label);
	const [description, setDescription] = useState(tranche.description);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-background rounded-lg p-6 w-full max-w-md">
				<h2 className="text-lg font-semibold mb-4">Edit Tranche</h2>
				
				<div className="space-y-4">
					<div>
						<label htmlFor="tranche-label" className="text-sm font-medium">Label</label>
						<input 
							id="tranche-label"
							type="text"
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							className="w-full mt-1 px-3 py-2 border rounded-md"
						/>
					</div>
					
					<div>
						<label htmlFor="tranche-description" className="text-sm font-medium">Description</label>
						<textarea 
							id="tranche-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full mt-1 px-3 py-2 border rounded-md h-20"
						/>
					</div>
				</div>

				<div className="flex gap-2 mt-6">
					<Button onClick={onClose} variant="outline">
						Cancel
					</Button>
					<Button onClick={() => onSave({ ...tranche, label, description })}>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}

// Simple edit modal for terms
function EditTermModal({ 
	term, 
	onClose, 
	onSave 
}: { 
	term: TrancheTerm;
	onClose: () => void;
	onSave: (term: TrancheTerm) => void;
}) {
	const [startDate, setStartDate] = useState(term.startDate.toISOString().split('T')[0]);
	const [endDate, setEndDate] = useState(term.endDate.toISOString().split('T')[0]);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-background rounded-lg p-6 w-full max-w-md">
				<h2 className="text-lg font-semibold mb-4">Edit Term</h2>
				
				<div className="space-y-4">
					<div>
						<label htmlFor="term-start-date" className="text-sm font-medium">Start Date</label>
						<input 
							id="term-start-date"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="w-full mt-1 px-3 py-2 border rounded-md"
						/>
					</div>
					
					<div>
						<label htmlFor="term-end-date" className="text-sm font-medium">End Date</label>
						<input 
							id="term-end-date"
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="w-full mt-1 px-3 py-2 border rounded-md"
						/>
					</div>
				</div>

				<div className="flex gap-2 mt-6">
					<Button onClick={onClose} variant="outline">
						Cancel
					</Button>
					<Button onClick={() => onSave({ 
						...term, 
						startDate: new Date(startDate), 
						endDate: new Date(endDate) 
					})}>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
