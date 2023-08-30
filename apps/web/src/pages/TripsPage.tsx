import { TripsList } from '@/components/trips/TripsList.jsx';
import { PageContent } from '@a-type/ui/components/layouts';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  return (
    <PageContent>
      <TripsList />
    </PageContent>
  );
}

export default TripsPage;
