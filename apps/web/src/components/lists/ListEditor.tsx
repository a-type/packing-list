import { List, ListItemsItem } from '@packing-list/verdant';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { Button } from '@a-type/ui/components/button';
import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';

export interface ListEditorProps {
  list: List;
}

export function ListEditor({ list }: ListEditorProps) {
  const { name } = hooks.useWatch(list);

  return (
    <div>
      <LiveUpdateTextField
        value={name}
        onChange={(name) => list.set('name', name)}
      />
      <ListItemsEditor list={list} />
      <AddListItemButton list={list} />
    </div>
  );
}

function ListItemsEditor({ list }: { list: List }) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);

  return (
    <ul className="mb-2 list-none mx-0 px-0 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.get('id')}>
          <ListItemEditor item={item} />
        </li>
      ))}
    </ul>
  );
}

function ListItemEditor({ item }: { item: ListItemsItem }) {
  const { description, quantity, additional, perDays, roundDown } =
    hooks.useWatch(item);
  return (
    <div className="flex flex-col gap-3 border border-solid border-gray-5 p-2 rounded-lg">
      <LiveUpdateTextField
        value={description}
        onChange={(v) => item.set('description', v)}
      />
      <div className="flex flex-row gap-1 flex-wrap items-center">
        <span>Pack</span>
        <NumberStepper
          increment={1}
          value={quantity}
          onChange={(v) => {
            if (v > 0) item.set('quantity', v);
          }}
        />
        <span>for every</span>
        {perDays > 0 ? (
          <div className="flex flex-row gap-1 items-center">
            <NumberStepper
              value={perDays}
              increment={1}
              onChange={(v) => {
                if (v >= 0) item.set('perDays', v);
              }}
            />
            <span>day{perDays === 1 ? '' : 's'}</span>
          </div>
        ) : (
          <div className="flex flex-row gap-1 items-center border border-gray-7 rounded-lg border-solid px-6">
            <span>trip</span>
            <Button
              size="icon"
              color="ghost"
              onClick={() => item.set('perDays', 1)}
            >
              +
            </Button>
          </div>
        )}
      </div>
      {additional > 0 ? (
        <div className="flex flex-row gap-1 items-center">
          <span>Plus</span>
          <NumberStepper
            value={additional}
            onChange={(v) => {
              if (v < 0) return;
              item.set('additional', v);
            }}
          />
          <span>extra per trip</span>
        </div>
      ) : (
        <div>
          <Button
            size="small"
            color="default"
            onClick={() => item.set('additional', 1)}
          >
            Add extra
          </Button>
        </div>
      )}
    </div>
  );
}

function AddListItemButton({ list }: { list: List }) {
  const { items } = hooks.useWatch(list);

  return (
    <Button
      color="primary"
      onClick={() =>
        items.push({
          description: 'New item',
        })
      }
    >
      Add Item
    </Button>
  );
}
