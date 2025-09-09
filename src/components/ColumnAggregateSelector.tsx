import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calculator, Check, X } from "lucide-react";
import { useState } from "react";
import {
	type AggregateType,
	aggregateConfigs,
	calculateAggregate,
} from "../lib/searchParams";

interface ColumnAggregateSelectorProps {
	columnId: string;
	columnLabel: string;
	data: number[];
	currentAggregate?: AggregateType;
	onAggregateChange: (
		columnId: string,
		aggregateType: AggregateType | null,
	) => void;
	formatValue?: (value: number) => string;
}

export const ColumnAggregateSelector = ({
	columnId,
	columnLabel,
	data,
	currentAggregate,
	onAggregateChange,
	formatValue = (v) => v.toString(),
}: ColumnAggregateSelectorProps) => {
	const [open, setOpen] = useState(false);
	const hasAggregate = !!currentAggregate;

	const handleAggregateSelect = (type: AggregateType) => {
		if (currentAggregate === type) {
			// Toggle off if same type is clicked
			onAggregateChange(columnId, null);
		} else {
			onAggregateChange(columnId, type);
		}
		setOpen(false);
	};

	const aggregateValue = currentAggregate
		? calculateAggregate(data, currentAggregate)
		: 0;

	const currentConfig = currentAggregate
		? aggregateConfigs[currentAggregate]
		: null;

	return (
		<div className="flex flex-col items-center">
			{hasAggregate && currentConfig && (
				<div
					className={`text-xs px-2 py-1 rounded-full ${currentConfig.bgColor} ${currentConfig.color} font-medium mb-1 flex items-center gap-1 group/aggregate`}
				>
					<span>
						{currentConfig.label}: {formatValue(aggregateValue)}
					</span>
					<Button
						variant="ghost"
						size="sm"
						className="h-3 w-3 p-0 opacity-0 group-hover/aggregate:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
						onClick={(e) => {
							e.stopPropagation();
							onAggregateChange(columnId, null);
						}}
					>
						<X className="h-2 w-2" />
					</Button>
				</div>
			)}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={`h-6 w-6 p-0 transition-all duration-200 opacity-0 group-hover:opacity-100 ${
							hasAggregate ? "opacity-100 text-primary" : ""
						}`}
					>
						<Calculator className="h-3 w-3" />
					</Button>
				</PopoverTrigger>
				<PopoverContent side="top" align="center" className="w-64 p-0">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">
								📊 {columnLabel} Aggregates
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="grid grid-cols-1 gap-1">
								{Object.values(aggregateConfigs).map((config) => {
									const isSelected = currentAggregate === config.type;
									const value = calculateAggregate(data, config.type);

									return (
										<Button
											key={config.type}
											variant="ghost"
											size="sm"
											className={`justify-between h-8 ${
												isSelected ? `${config.bgColor} ${config.color}` : ""
											}`}
											onClick={() => handleAggregateSelect(config.type)}
										>
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full ${config.bgColor.replace("bg-", "bg-").replace("-100", "-500")}`}
												/>
												<span className="text-sm">{config.label}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-xs font-mono">
													{formatValue(value)}
												</span>
												{isSelected && <Check className="h-3 w-3" />}
											</div>
										</Button>
									);
								})}
							</div>

							{hasAggregate && (
								<div className="pt-2 border-t">
									<Button
										variant="outline"
										size="sm"
										className="w-full h-7 text-xs"
										onClick={() => {
											onAggregateChange(columnId, null);
											setOpen(false);
										}}
									>
										Clear Aggregate
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</PopoverContent>
			</Popover>
		</div>
	);
};
