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
import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useSearchParams } from '@verdant-web/react-router';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';

export interface TripViewProps {
  tripId: string;
}

export function TripView({ tripId }: TripViewProps) {
  const trip = hooks.useTrip(tripId);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <TripViewInfo trip={trip} />
      <AddListsPicker trip={trip} />
      <TripViewChecklists trip={trip} />
    </div>
  );
}

function TripViewInfo({ trip }: { trip: Trip }) {
  const { name, createdAt, days } = hooks.useWatch(trip);
  return (
    <div>
      <LiveUpdateTextField
        value={name}
        onChange={(v) => trip.set('name', v)}
        className="text-xl"
      />
      <p>Created on {new Date(createdAt).toLocaleDateString()}</p>
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

function TripViewChecklists({ trip }: { trip: Trip }) {
  const { lists, days, completions } = hooks.useWatch(trip);
  hooks.useWatch(lists);
  const allLists = hooks.useAllLists();

  const mappedLists = lists
    .map((id) => allLists.find((l) => l.get('id') === id))
    .filter(function nonNil<T>(x: T | undefined): x is T {
      return x !== undefined;
    });

  const [params, setParams] = useSearchParams();
  const activeList = params.get('list') ?? lists.get(0);

  if (!activeList) {
    return <div>Add a list to start packing</div>;
  }

  return (
    <div>
      <TabsRoot
        value={activeList}
        onValueChange={(val) => {
          setParams((params) => {
            params.set('list', val);
            return params;
          });
        }}
      >
        <TabsList className="important:justify-start">
          {mappedLists.map((list) => (
            <TabsTrigger key={list.get('id')} value={list.get('id')}>
              {list.get('name')}
            </TabsTrigger>
          ))}
        </TabsList>
        {mappedLists.map((list) => (
          <TabsContent key={list.get('id')} value={list.get('id')}>
            <TripViewChecklist
              key={list.get('id')}
              list={list}
              days={days}
              completions={completions}
            />
          </TabsContent>
        ))}
      </TabsRoot>
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
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);
  hooks.useWatch(completions);

  return (
    <ul className="list-none flex flex-col gap-3 m-0 p-0">
      {items.map((item) => {
        const completion = completions.get(item.get('id')) ?? 0;
        return (
          <li key={item.get('id')} className="m-0 p-0">
            <TripViewChecklistItem
              item={item}
              days={days}
              completion={completion}
              onCompletionChanged={(value) => {
                completions.set(item.get('id'), value);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}

function TripViewChecklistItem({
  item,
  days,
  completion,
  onCompletionChanged,
}: {
  item: ListItemsItem;
  days: number;
  completion: TripCompletionsValue;
  onCompletionChanged: (completion: TripCompletionsValue) => void;
}) {
  const { description, perDays, quantity, additional, roundDown } =
    hooks.useWatch(item);
  const completedQuantity = completion;
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
      onCompletionChanged(computedQuantity);
    } else {
      onCompletionChanged(0);
    }
  };
  const subOnChecked = (checked: boolean) => {
    if (checked) {
      onCompletionChanged(completedQuantity + 1);
    } else {
      onCompletionChanged(completedQuantity - 1);
    }
  };

  return (
    <div className="w-full border border-solid border-gray-4 rounded-lg p-2 flex flex-col gap-2">
      <div className="w-full flex flex-row items-center gap-2">
        {computedQuantity === 1 && (
          <Checkbox
            checked={completed}
            onCheckedChange={mainOnChecked}
            className="w-32px h-32px"
          />
        )}
        <label>{description}</label>
        <span className="text-gray-7">×{computedQuantity}</span>
      </div>
      {computedQuantity > 1 && (
        <ul className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] [grid-auto-rows:32px] items-center gap-1">
          {Array.from({ length: computedQuantity }).map((_, i) => (
            <li key={i} className="m-0 p-0 flex-1 min-w-32px">
              <Checkbox
                checked={i < completedQuantity}
                onCheckedChange={subOnChecked}
                className="w-full h-32px"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
