import { AddListButton } from '@/components/lists/AddListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { RouteDialog } from '@/components/nav/RouteDialog.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { TabsList } from '@a-type/ui/components/tabs';

export interface ListsPageProps {}

export function ListsPage({}: ListsPageProps) {
  return (
    <PageContent>
      <PageFixedArea className="flex flex-col items-start gap-2">
        <NavigationTabsRoot className="w-full">
          <TabsList>
            <NavigationTab value="/trips">Trips</NavigationTab>
            <NavigationTab value="/lists">Lists</NavigationTab>
          </TabsList>
        </NavigationTabsRoot>
        <AddListButton>New list</AddListButton>
      </PageFixedArea>
      <ListsList />
      <RouteDialog />
    </PageContent>
  );
}

export default ListsPage;
