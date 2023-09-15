import { hooks } from '@/store.js';
import { Trip } from '@packing-list/verdant';
import { useState } from 'react';
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from '@a-type/ui/components/collapsible';
import { Button } from '@a-type/ui/components/button';

export interface AddListsPickerProps {
  trip: Trip;
}

export function AddListsPicker({ trip }: AddListsPickerProps) {
  const lists = hooks.useAllLists();

  const tripLists = hooks.useWatch(trip.get('lists'));

  // initialize open from whether the trip has lists or not at mount
  const [open, setOpen] = useState(() => !trip.get('lists').length);
  const [startedOpen] = useState(open);

  return (
    <CollapsibleRoot
      open={open}
      onOpenChange={setOpen}
      className="border border-solid border-gray-4 rounded-lg max-w-400px w-full"
    >
      <CollapsibleTrigger className="appearance-none p-3 bg-transparent border-none outline-none text-md w-full cursor-pointer flex flex-row items-center justify-between">
        <span>{startedOpen ? 'Add lists' : 'Edit lists'}</span>
        {!startedOpen && <div className="i-solar-settings-linear" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 flex flex-col items-start gap-3">
          <div className="flex flex-row items-center flex-wrap">
            {lists.map((list) => {
              const id = list.get('id');
              const active = tripLists.includes(id);
              return (
                <Button
                  key={id}
                  size="small"
                  color={active ? 'primary' : 'default'}
                  onClick={() => {
                    if (active) {
                      trip.get('lists').removeAll(list.get('id'));
                    } else {
                      trip.get('lists').add(list.get('id'));
                    }
                  }}
                >
                  <div
                    className={
                      active
                        ? `i-solar-check-circle-linear`
                        : `i-solar-add-circle-linear`
                    }
                  />
                  {list.get('name')}
                </Button>
              );
            })}
          </div>
          <Button size="small" color="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}
