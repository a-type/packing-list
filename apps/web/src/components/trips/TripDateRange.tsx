import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Trip } from '@packing-list/verdant';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@a-type/ui/components/popover';
import { DateRangePicker } from '@a-type/ui/components/datePicker';
import { Icon } from '@a-type/ui/components/icon';
import { useState } from 'react';
import format from 'date-fns/format';
import { useTripDays } from './hooks.js';

export interface TripDateRangeProps {
  trip: Trip;
}

// day, month date(th)
function formatDay(date: Date) {
  return format(date, 'EEEE, MMM do');
}

export function TripDateRange({ trip }: TripDateRangeProps) {
  const { startsAt, endsAt } = hooks.useWatch(trip);
  const days = useTripDays(trip);

  const displayString =
    startsAt && endsAt
      ? `${days} days: ${formatDay(new Date(startsAt))} - ${formatDay(
          new Date(endsAt),
        )}`
      : 'Select dates';

  const value = {
    start: startsAt ? new Date(startsAt) : null,
    end: endsAt ? new Date(endsAt) : null,
  };
  const onChange = (newDates: { start: Date | null; end: Date | null }) => {
    if (!newDates.start || !newDates.end) {
      return;
    }
    trip.set('startsAt', newDates.start.getTime());
    trip.set('endsAt', newDates.end.getTime());
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          color={days === 0 ? 'primary' : 'ghost'}
          className={days === 0 ? '' : 'font-normal'}
        >
          <Icon name="calendar" />
          <span>{displayString}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-dialog">
        <PopoverArrow />
        <DateRangePicker value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
