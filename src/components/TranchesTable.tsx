import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit, Eye, MoreHorizontal, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { FilterableTableHead } from "./FilterableTableHead";
import { formatRate } from "../data/mockTranches";
import type { TrancheWithDealer } from "../types";

interface TranchesTableProps {
	tranches: TrancheWithDealer[];
	dealerFilter: string;
	labelFilter: string;
	statusFilter: string;
	statusOptions: { value: string; label: string }[];
	onDealerFilterChange: (filter: string) => void;
	onLabelFilterChange: (filter: string) => void;
	onStatusFilterChange: (filter: string) => void;
	onClearFilters: () => void;
	onEdit?: (tranche: TrancheWithDealer) => void;
	onView?: (tranche: TrancheWithDealer) => void;
	onDelete?: (tranche: TrancheWithDealer) => void;
}

export const TranchesTable = ({
	tranches,
	dealerFilter,
	labelFilter,
	statusFilter,
	statusOptions,
	onDealerFilterChange,
	onLabelFilterChange,
	onStatusFilterChange,
	onClearFilters,
	onEdit,
	onView,
	onDelete,
}: TranchesTableProps) => {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	const getTrancheStatus = (tranche: TrancheWithDealer): "active" | "expired" | "upcoming" => {
		const today = new Date();
		const hasActiveTerm = tranche.trancheTerms.some(
			(term) => term.startDate <= today && term.endDate >= today,
		);
		const hasExpiredTerm = tranche.trancheTerms.some((term) => term.endDate < today);
		const hasUpcomingTerm = tranche.trancheTerms.some((term) => term.startDate > today);

		if (hasActiveTerm) return "active";
		if (hasUpcomingTerm && !hasActiveTerm) return "upcoming";
		return "expired";
	};

	const getStatusBadge = (status: "active" | "expired" | "upcoming") => {
		const variants = {
			active: "default",
			upcoming: "secondary",
			expired: "outline",
		} as const;

		const labels = {
			active: "Active",
			upcoming: "Upcoming",
			expired: "Expired",
		};

		return <Badge variant={variants[status]}>{labels[status]}</Badge>;
	};

	const handleEdit = (tranche: TrancheWithDealer) => {
		if (onEdit) {
			onEdit(tranche);
		} else {
			toast.info(`Edit tranche: ${tranche.label}`);
		}
	};

	const handleView = (tranche: TrancheWithDealer) => {
		if (onView) {
			onView(tranche);
		} else {
			toast.info(`View tranche details: ${tranche.label}`);
		}
	};

	const handleDelete = (tranche: TrancheWithDealer) => {
		if (onDelete) {
			onDelete(tranche);
		} else {
			toast.error(`Delete tranche: ${tranche.label}`);
		}
	};

	// Get date range for tranche (earliest start to latest end)
	const getTrancheeDateRange = (tranche: TrancheWithDealer) => {
		if (tranche.trancheTerms.length === 0) return "No terms";
		
		const startDates = tranche.trancheTerms.map(term => term.startDate);
		const endDates = tranche.trancheTerms.map(term => term.endDate);
		
		const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
		const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
		
		return `${formatDate(earliestStart)} - ${formatDate(latestEnd)}`;
	};

	// Get primary rates (from first term for simplicity)
	const getPrimaryRates = (tranche: TrancheWithDealer) => {
		if (tranche.trancheTerms.length === 0) return { retailer: "N/A", grower: "N/A" };
		
		const firstTerm = tranche.trancheTerms[0];
		return {
			retailer: formatRate(firstTerm.retailerRate),
			grower: formatRate(firstTerm.growerRate),
		};
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50 hover:bg-muted/50">
							<FilterableTableHead
								filterType="text"
								filterValue={labelFilter}
								onFilterChange={onLabelFilterChange}
								placeholder="Filter labels..."
							>
								Label
							</FilterableTableHead>
							<FilterableTableHead
								filterType="text"
								filterValue={dealerFilter}
								onFilterChange={onDealerFilterChange}
								placeholder="Filter dealers..."
							>
								Dealer
							</FilterableTableHead>
							<FilterableTableHead
								filterType="select"
								filterValue={statusFilter}
								onFilterChange={onStatusFilterChange}
								selectOptions={statusOptions}
								placeholder="Filter status..."
							>
								Status
							</FilterableTableHead>
							<TableHead className="font-semibold text-foreground">Date Range</TableHead>
							<TableHead className="font-semibold text-foreground">Terms</TableHead>
							<TableHead className="font-semibold text-foreground">Retailer Rate</TableHead>
							<TableHead className="font-semibold text-foreground">Grower Rate</TableHead>
							<TableHead className="w-[1%] text-right font-semibold text-foreground">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tranches.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center text-muted-foreground">
									No tranches found
								</TableCell>
							</TableRow>
						) : (
							tranches.map((tranche) => {
								const status = getTrancheStatus(tranche);
								const rates = getPrimaryRates(tranche);
								return (
									<TableRow key={tranche.id}>
										<TableCell className="font-medium">{tranche.label}</TableCell>
										<TableCell>{tranche.dealerId.name}</TableCell>
										<TableCell>{getStatusBadge(status)}</TableCell>
										<TableCell className="text-sm">
											{getTrancheeDateRange(tranche)}
										</TableCell>
										<TableCell className="text-center">
											{tranche.trancheTerms.length}
										</TableCell>
										<TableCell className="text-sm">{rates.retailer}</TableCell>
										<TableCell className="text-sm">{rates.grower}</TableCell>
										<TableCell className="text-right">
											<Popover>
												<PopoverTrigger asChild>
													<Button variant="ghost" size="icon" aria-label="Row actions">
														<MoreHorizontal />
													</Button>
												</PopoverTrigger>
												<PopoverContent align="end" className="w-48 p-1">
													<button
														type="button"
														className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent text-left text-sm"
														onClick={() => handleView(tranche)}
													>
														<Eye className="size-4" />
														View Details
													</button>
													<button
														type="button"
														className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent text-left text-sm"
														onClick={() => handleEdit(tranche)}
													>
														<Edit className="size-4" />
														Edit Tranche
													</button>
													<button
														type="button"
														className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent text-left text-sm text-destructive hover:text-destructive"
														onClick={() => handleDelete(tranche)}
													>
														<Trash2 className="size-4" />
														Delete Tranche
													</button>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			<div className="text-sm text-muted-foreground">
				Showing {tranches.length} tranche{tranches.length !== 1 ? "s" : ""}
			</div>

			{/* Active Filters */}
			{(dealerFilter || labelFilter || statusFilter !== "all") && (
				<div className="flex flex-wrap gap-2 items-center">
					<span className="text-sm font-medium text-muted-foreground">Active filters:</span>
					
					{dealerFilter && (
						<Badge variant="secondary" className="gap-1">
							Dealer: {dealerFilter}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-muted-foreground hover:text-foreground"
								onClick={() => onDealerFilterChange("")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{labelFilter && (
						<Badge variant="secondary" className="gap-1">
							Label: {labelFilter}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-muted-foreground hover:text-foreground"
								onClick={() => onLabelFilterChange("")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{statusFilter !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-muted-foreground hover:text-foreground"
								onClick={() => onStatusFilterChange("all")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					<Button
						variant="ghost"
						size="sm"
						onClick={onClearFilters}
						className="text-muted-foreground hover:text-foreground"
					>
						Clear all
					</Button>
				</div>
			)}
		</div>
	);
};
