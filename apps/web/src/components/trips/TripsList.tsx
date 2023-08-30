import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { CardMain, CardRoot } from '@a-type/ui/components/card';
import { Trip } from '@packing-list/verdant';
import { Link } from '@verdant-web/react-router';

export interface TripsListProps {}

export function TripsList({}: TripsListProps) {
  const [trips, tools] = hooks.useAllTripsInfinite({
    pageSize: 10,
    key: 'trips',
    index: {
      where: 'createdAt',
      order: 'desc',
    },
  });

  return (
    <div>
      <h1>Trips</h1>
      <AddTripButton />
      <ul className="list-none p-0 m-0">
        {trips.map((trip) => (
          <li key={trip.get('id')} className="p-0 m-0">
            <TripsListItem trip={trip} />
          </li>
        ))}
      </ul>
      {tools.hasMore && (
        <Button onClick={() => tools.loadMore()}>Show older</Button>
      )}
    </div>
  );
}

function TripsListItem({ trip }: { trip: Trip }) {
  const { name } = hooks.useWatch(trip);

  return (
    <CardRoot>
      <CardMain asChild>
        <Link to={`/trips/${trip.get('id')}`}>{name}</Link>
      </CardMain>
    </CardRoot>
  );
}
