import { TableCell, TableRow } from "@/components/ui/table";
import type { AggregateType } from "../lib/searchParams";
import { ColumnAggregateSelector } from "./ColumnAggregateSelector";

interface ColumnConfig {
	id: string;
	index: number;
	label: string;
	data: number[];
	formatValue?: (value: number) => string;
}

interface TableFooterWithAggregatesProps {
	columns: ColumnConfig[];
	totalColumns: number;
	activeAggregates: Record<string, AggregateType>;
	onAggregateChange: (
		columnId: string,
		aggregateType: AggregateType | null,
	) => void;
}

export const TableFooterWithAggregates = ({
	columns,
	totalColumns,
	activeAggregates,
	onAggregateChange,
}: TableFooterWithAggregatesProps) => {
	return (
		<TableRow className="border-t-2 bg-muted/30 hover:bg-muted/40 transition-colors group">
			{Array.from({ length: totalColumns }, (_, index) => {
				const column = columns.find((col) => col.index === index);

				return (
					<TableCell key={index} className="relative text-center">
						{column && (
							<ColumnAggregateSelector
								columnId={column.id}
								columnLabel={column.label}
								data={column.data}
								currentAggregate={activeAggregates[column.id]}
								onAggregateChange={onAggregateChange}
								formatValue={column.formatValue}
							/>
						)}
					</TableCell>
				);
			})}
		</TableRow>
	);
};
