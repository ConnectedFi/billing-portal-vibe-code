import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import {
	getLastMonthRange,
	getLastWeekRange,
	getLastYearRange,
} from "../data/mockData";
import type { DatePreset, DateRange } from "../types";

interface DateRangeSelectorProps {
	dateRange: DateRange;
	onDateRangeChange: (range: DateRange) => void;
	onClearDateRange?: () => void;
}

export const DateRangeSelector = ({
	dateRange,
	onDateRangeChange,
	onClearDateRange,
}: DateRangeSelectorProps) => {
	const [preset, setPreset] = useState<DatePreset>(() => {
		// Determine initial preset based on current date range
		if (!dateRange.from && !dateRange.to) return "none";
		return "custom";
	});
	const [fromOpen, setFromOpen] = useState(false);
	const [toOpen, setToOpen] = useState(false);

	const handlePresetChange = (newPreset: DatePreset) => {
		setPreset(newPreset);

		if (newPreset === "none") {
			onClearDateRange?.();
		} else if (newPreset === "last-week") {
			onDateRangeChange(getLastWeekRange());
		} else if (newPreset === "last-month") {
			onDateRangeChange(getLastMonthRange());
		} else if (newPreset === "last-year") {
			onDateRangeChange(getLastYearRange());
		}
	};

	const handleFromDateSelect = (date: Date | undefined) => {
		onDateRangeChange({ ...dateRange, from: date });
		setFromOpen(false);
		setPreset("custom");
	};

	const handleToDateSelect = (date: Date | undefined) => {
		onDateRangeChange({ ...dateRange, to: date });
		setToOpen(false);
		setPreset("custom");
	};

	const formatDate = (date?: Date) => {
		if (!date) return "--";
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);
	};

	const hasDateFilter = dateRange.from || dateRange.to;

	return (
		<div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
			<span className="text-sm font-medium text-muted-foreground">
				Date Range:
			</span>

			<Select value={preset} onValueChange={handlePresetChange}>
				<SelectTrigger className="w-[110px] h-8 text-sm">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="none">None</SelectItem>
					<SelectItem value="last-week">Last Week</SelectItem>
					<SelectItem value="last-month">Last Month</SelectItem>
					<SelectItem value="last-year">Last Year</SelectItem>
					<SelectItem value="custom">Custom</SelectItem>
				</SelectContent>
			</Select>

			<div className="flex items-center gap-2">
				<Popover open={fromOpen} onOpenChange={setFromOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={`w-[180px] h-8 justify-start text-left font-normal text-sm ${
								!dateRange.from ? "text-muted-foreground" : ""
							}`}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{formatDate(dateRange.from)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={dateRange.from}
							onSelect={handleFromDateSelect}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				<span className="text-sm text-muted-foreground">to</span>

				<Popover open={toOpen} onOpenChange={setToOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={`w-[180px] h-8 justify-start text-left font-normal text-sm ${
								!dateRange.to ? "text-muted-foreground" : ""
							}`}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{formatDate(dateRange.to)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={dateRange.to}
							onSelect={handleToDateSelect}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				{hasDateFilter && onClearDateRange && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
						onClick={onClearDateRange}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
};
