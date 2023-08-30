import { TripView } from '@/components/trips/TripView.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface TripPageProps {}

export function TripPage({}: TripPageProps) {
  const params = useParams();
  const tripId = params.tripId;
  return (
    <PageContent>
      <PageFixedArea>
        <Link to="/trips">Back to trips</Link>
      </PageFixedArea>
      <Suspense>
        <TripView tripId={tripId} />
      </Suspense>
    </PageContent>
  );
}

export default TripPage;
