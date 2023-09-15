import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { RouteDialog } from '@/components/nav/RouteDialog.jsx';
import { AddTripButton } from '@/components/trips/AddTripButton.jsx';
import { TripsList } from '@/components/trips/TripsList.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { TabsList } from '@a-type/ui/components/tabs';

export interface TripsPageProps {}

export function TripsPage({}: TripsPageProps) {
  return (
    <PageContent>
      <PageFixedArea className="flex flex-col items-start gap-2 mb-4">
        <NavigationTabsRoot className="w-full">
          <TabsList>
            <NavigationTab value="/trips">Trips</NavigationTab>
            <NavigationTab value="/lists">Lists</NavigationTab>
          </TabsList>
        </NavigationTabsRoot>
        <AddTripButton />
      </PageFixedArea>
      <TripsList />
      <RouteDialog />
    </PageContent>
  );
}

export default TripsPage;
