import { hooks } from '@/store.js';
import { Trip } from '@packing-list/verdant';

export function useTripProgress(trip: Trip) {
  const { lists, completions } = hooks.useWatch(trip);
  hooks.useWatch(lists);
  hooks.useWatch(completions);
  const allLists = hooks.useAllLists();

  const mappedLists = lists
    .map((id) => allLists.find((l) => l.get('id') === id))
    .filter(function nonNil<T>(x: T | undefined): x is T {
      return x !== undefined;
    });

  const totalItems = mappedLists.reduce((acc, list) => {
    return acc + list.get('items').length;
  }, 0);

  // starting from lists because completions may include data
  // from lists that are no longer included
  const completedItems = lists.getSnapshot().reduce((acc, listId) => {
    const list = allLists.find((l) => l.get('id') === listId);
    if (!list) {
      return acc;
    }
    const listItems = list.get('items');
    const completedQuantities = listItems.getSnapshot().reduce((acc2, item) => {
      return acc2 + (completions.get(item.id!) ?? 0);
    }, 0);
    return acc + completedQuantities;
  }, 0);

  return {
    totalItems,
    completedItems,
    value: completedItems / totalItems,
  };
}
