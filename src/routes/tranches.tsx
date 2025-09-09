import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { TranchesTable } from "../components/TranchesTable";
import { mockTranches } from "../data/mockTranches";
import type { TrancheWithDealer } from "../types";

// Search params schema for tranches page
const tranchesSearchSchema = z.object({
	dealerFilter: z.string().optional().default(""),
	labelFilter: z.string().optional().default(""),
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
	const dealerFilter = search.dealerFilter;
	const labelFilter = search.labelFilter;
	const statusFilter = search.status;

	// Local state for edit modal
	const [editingTranche, setEditingTranche] = useState<TrancheWithDealer | null>(null);

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

	const setStatusFilter = (status: "all" | "active" | "expired" | "upcoming") => {
		updateSearch({ status });
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

	// Handle tranche actions
	const handleCreateTranche = () => {
		toast.info("Create new tranche functionality coming soon!");
	};

	const handleEditTranche = (tranche: TrancheWithDealer) => {
		setEditingTranche(tranche);
		toast.info(`Opening edit form for: ${tranche.label}`);
	};

	const handleViewTranche = (tranche: TrancheWithDealer) => {
		toast.info(`Viewing details for: ${tranche.label}`);
	};

	const handleDeleteTranche = (tranche: TrancheWithDealer) => {
		toast.error(`Delete tranche: ${tranche.label} (confirmation dialog would appear here)`);
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

			{/* Tranches Table with Filters */}
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
						onClearFilters={() => {
							setDealerFilter("");
							setLabelFilter("");
							setStatusFilter("all");
						}}
					/>
				</CardContent>
			</Card>

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
		</div>
	);
}

// Simple edit modal component (placeholder for now)
function EditTrancheModal({ 
	tranche, 
	onClose, 
	onSave 
}: { 
	tranche: TrancheWithDealer;
	onClose: () => void;
	onSave: (tranche: TrancheWithDealer) => void;
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
