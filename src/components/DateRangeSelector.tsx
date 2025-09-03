import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [showCalendar, setShowCalendar] = useState(false);

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
    <Card>
      <CardHeader>
        <CardTitle>Date Range Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap items-center">
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex flex-col space-y-2">
            <label htmlFor="from-date" className="text-sm font-medium">From</label>
            <Input
              id="from-date"
              type="date"
              value={formatDateForInput(dateRange.from)}
              onChange={handleFromDateChange}
              className="w-[150px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="to-date" className="text-sm font-medium">To</label>
            <Input
              id="to-date"
              type="date"
              value={formatDateForInput(dateRange.to)}
              onChange={handleToDateChange}
              className="w-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
