import { AddListButton } from '@/components/lists/AddListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';

export interface ListsPageProps {}

export function ListsPage({}: ListsPageProps) {
  return (
    <PageContent>
      <PageFixedArea className="flex flex-row items-center gap-2">
        <AddListButton>New list</AddListButton>
      </PageFixedArea>
      <ListsList />
    </PageContent>
  );
}

export default ListsPage;
