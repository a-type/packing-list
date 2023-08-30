import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import {
  List,
  ListItemsItem,
  Trip,
  TripCompletions,
  TripCompletionsValue,
} from '@packing-list/verdant';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { getComputedQuantity } from '@/components/trips/utils.js';
import { useEffect } from 'react';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@a-type/ui/components/select';

export interface TripViewProps {
  tripId: string;
}

export function TripView({ tripId }: TripViewProps) {
  const trip = hooks.useTrip(tripId);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div>
      <TripViewInfo trip={trip} />
      <TripViewChecklists trip={trip} />
      <TripViewAddList trip={trip} />
    </div>
  );
}

function TripViewInfo({ trip }: { trip: Trip }) {
  const { name, createdAt, days } = hooks.useWatch(trip);
  return (
    <div>
      <h1>{name}</h1>
      <p>{createdAt}</p>
      <div className="flex flex-row items-center gap-2">
        <NumberStepper
          value={days}
          increment={1}
          onChange={(v) => trip.set('days', v)}
        />
        <span>days</span>
      </div>
    </div>
  );
}

function TripViewAddList({ trip }: { trip: Trip }) {
  const lists = hooks.useAllLists();

  return (
    <Select
      value=""
      onValueChange={(val) => {
        if (val) trip.get('lists').add(val);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="" disabled>
          Add a list
        </SelectItem>
        {lists.map((list) => (
          <SelectItem key={list.get('id')} value={list.get('id')}>
            {list.get('name')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TripViewChecklists({ trip }: { trip: Trip }) {
  const { lists, days, completions } = hooks.useWatch(trip);
  hooks.useWatch(lists);
  const allLists = hooks.useAllLists();

  const mappedLists = lists
    .map((id) => allLists.find((l) => l.get('id') === id))
    .filter(function nonNil<T>(x: T | undefined): x is T {
      return x !== undefined;
    });

  return (
    <div>
      {mappedLists.map((list) => (
        <TripViewChecklist
          key={list.get('id')}
          list={list}
          days={days}
          completions={completions}
        />
      ))}
    </div>
  );
}

function TripViewChecklist({
  list,
  days,
  completions,
}: {
  list: List;
  days: number;
  completions: TripCompletions;
}) {
  const { name, items } = hooks.useWatch(list);
  hooks.useWatch(items);
  hooks.useWatch(completions);

  useEffect(() => {
    items.forEach((item) => {
      if (!completions.get(item.get('id'))) {
        completions.set(item.get('id'), {
          quantity: 0,
        });
      }
    });
  }, [items, completions]);

  return (
    <div>
      <h2>{name}</h2>
      <ul className="list-none flex flex-col gap-3 m-0 p-0">
        {items.map((item) => {
          const completion = completions.get(item.get('id'));
          if (!completion) {
            return null;
          }
          return (
            <li key={item.get('id')} className="m-0 p-0">
              <TripViewChecklistItem
                item={item}
                days={days}
                completion={completion}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TripViewChecklistItem({
  item,
  days,
  completion,
}: {
  item: ListItemsItem;
  days: number;
  completion: TripCompletionsValue;
}) {
  const { description, perDays, quantity, additional, roundDown } =
    hooks.useWatch(item);
  hooks.useWatch(completion);
  const completedQuantity = completion?.get('quantity') ?? 0;
  const computedQuantity = getComputedQuantity({
    perDays,
    quantity,
    days,
    additional,
    roundDown,
  });
  const completed = completedQuantity >= computedQuantity;

  const mainOnChecked = (checked: boolean) => {
    if (checked) {
      completion?.set('quantity', computedQuantity);
    } else {
      completion?.set('quantity', 0);
    }
  };
  const subOnChecked = (checked: boolean) => {
    if (checked) {
      completion?.set('quantity', completedQuantity + 1);
    } else {
      completion?.set('quantity', completedQuantity - 1);
    }
  };

  if (computedQuantity > 1) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-row items-center gap-2">
          <Checkbox checked={completed} onCheckedChange={mainOnChecked} />
          <label>{description}</label>
        </div>
        <ul className="list-none m-0 ml-6 p-0 flex flex-row items-center gap-1 flex-wrap w-full">
          {Array.from({ length: computedQuantity }).map((_, i) => (
            <li key={i} className="m-0 p-0">
              <Checkbox
                checked={i < completedQuantity}
                onCheckedChange={subOnChecked}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row items-center gap-2">
      <Checkbox checked={completed} onCheckedChange={mainOnChecked} />
      <label>{description}</label>
    </div>
  );
}
