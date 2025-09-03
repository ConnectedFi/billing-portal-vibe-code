import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { getLastMonthRange, getLastWeekRange } from '../data/mockData';
import type { DatePreset, DateRange } from '../types';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangeSelector = ({ dateRange, onDateRangeChange }: DateRangeSelectorProps) => {
  const [preset, setPreset] = useState<DatePreset>('custom');

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    
    if (newPreset === 'last-week') {
      onDateRangeChange(getLastWeekRange());
    } else if (newPreset === 'last-month') {
      onDateRangeChange(getLastMonthRange());
    }
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!Number.isNaN(newDate.getTime())) {
      onDateRangeChange({ ...dateRange, from: newDate });
      setPreset('custom');
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!Number.isNaN(newDate.getTime())) {
      onDateRangeChange({ ...dateRange, to: newDate });
      setPreset('custom');
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
      <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[110px] h-8 text-sm">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-week">Last Week</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Input
          id="from-date"
          type="date"
          value={formatDateForInput(dateRange.from)}
          onChange={handleFromDateChange}
          className="w-[130px] h-8 text-sm"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          id="to-date"
          type="date"
          value={formatDateForInput(dateRange.to)}
          onChange={handleToDateChange}
          className="w-[130px] h-8 text-sm"
        />
      </div>
    </div>
  );
};
