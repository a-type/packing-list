import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { PageContent } from '@a-type/ui/components/layouts';
import { TabsList, TabsRoot } from '@a-type/ui/components/tabs';
import { Outlet } from '@verdant-web/react-router';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  return (
    <PageContent>
      <NavigationTabsRoot>
        <TabsList>
          <NavigationTab value="/trips">Trips</NavigationTab>
          <NavigationTab value="/lists">Lists</NavigationTab>
        </TabsList>
      </NavigationTabsRoot>
      <Outlet />
    </PageContent>
  );
}

export default HomePage;
