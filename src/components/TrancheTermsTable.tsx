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
import { formatRate, getTrancheNameById } from "../data/mockTranches";
import type { TrancheTerm } from "../types";
import { FilterableTableHead } from "./FilterableTableHead";

interface TrancheTermsTableProps {
	terms: TrancheTerm[];
	trancheFilter: string;
	statusFilter: string;
	statusOptions: { value: string; label: string }[];
	onTrancheFilterChange: (filter: string) => void;
	onStatusFilterChange: (filter: string) => void;
	onClearFilters: () => void;
	onEdit?: (term: TrancheTerm) => void;
	onView?: (term: TrancheTerm) => void;
	onDelete?: (term: TrancheTerm) => void;
}

export const TrancheTermsTable = ({
	terms,
	trancheFilter,
	statusFilter,
	statusOptions,
	onTrancheFilterChange,
	onStatusFilterChange,
	onClearFilters,
	onEdit,
	onView,
	onDelete,
}: TrancheTermsTableProps) => {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	const getTermStatus = (term: TrancheTerm): "active" | "expired" | "upcoming" => {
		const today = new Date();
		if (term.startDate <= today && term.endDate >= today) return "active";
		if (term.endDate < today) return "expired";
		return "upcoming";
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

	const handleEdit = (term: TrancheTerm) => {
		if (onEdit) {
			onEdit(term);
		} else {
			toast.info(`Edit term: ${term.id}`);
		}
	};

	const handleView = (term: TrancheTerm) => {
		if (onView) {
			onView(term);
		} else {
			toast.info(`View term details: ${term.id}`);
		}
	};

	const handleDelete = (term: TrancheTerm) => {
		if (onDelete) {
			onDelete(term);
		} else {
			toast.error(`Delete term: ${term.id}`);
		}
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50 hover:bg-muted/50">
							<TableHead className="font-semibold text-foreground">Term ID</TableHead>
							<FilterableTableHead
								filterType="text"
								filterValue={trancheFilter}
								onFilterChange={onTrancheFilterChange}
								placeholder="Filter tranches..."
							>
								Tranche
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
							<TableHead className="font-semibold text-foreground">Start Date</TableHead>
							<TableHead className="font-semibold text-foreground">End Date</TableHead>
							<TableHead className="font-semibold text-foreground">Onboard Date</TableHead>
							<TableHead className="font-semibold text-foreground">Retailer Rate</TableHead>
							<TableHead className="font-semibold text-foreground">Grower Rate</TableHead>
							<TableHead className="w-[1%] text-right font-semibold text-foreground">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{terms.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center text-muted-foreground">
									No terms found
								</TableCell>
							</TableRow>
						) : (
							terms.map((term) => {
								const status = getTermStatus(term);
								const trancheName = getTrancheNameById(term.trancheId);
								return (
									<TableRow key={term.id}>
										<TableCell className="font-mono text-sm">{term.id}</TableCell>
										<TableCell className="font-medium">{trancheName}</TableCell>
										<TableCell>{getStatusBadge(status)}</TableCell>
										<TableCell>{formatDate(term.startDate)}</TableCell>
										<TableCell>{formatDate(term.endDate)}</TableCell>
										<TableCell>{formatDate(term.onBoardDate)}</TableCell>
										<TableCell className="text-sm">{formatRate(term.retailerRate)}</TableCell>
										<TableCell className="text-sm">{formatRate(term.growerRate)}</TableCell>
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
														onClick={() => handleView(term)}
													>
														<Eye className="size-4" />
														View Details
													</button>
													<button
														type="button"
														className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent text-left text-sm"
														onClick={() => handleEdit(term)}
													>
														<Edit className="size-4" />
														Edit Term
													</button>
													<button
														type="button"
														className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent text-left text-sm text-destructive hover:text-destructive"
														onClick={() => handleDelete(term)}
													>
														<Trash2 className="size-4" />
														Delete Term
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
				Showing {terms.length} term{terms.length !== 1 ? "s" : ""}
			</div>

			{/* Active Filters */}
			{(trancheFilter || statusFilter !== "all") && (
				<div className="flex flex-wrap gap-2 items-center">
					<span className="text-sm font-medium text-muted-foreground">Active filters:</span>
					
					{trancheFilter && (
						<Badge variant="secondary" className="gap-1">
							Tranche: {trancheFilter}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-muted-foreground hover:text-foreground"
								onClick={() => onTrancheFilterChange("")}
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
