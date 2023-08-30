import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { hooks } from '@/store.js';
import { Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
  const params = useParams();
  const listId = params.listId;

  return (
    <PageContent>
      <PageFixedArea className="py-2">
        <Link to="/lists">Back to lists</Link>
      </PageFixedArea>
      <Suspense>
        <ListPageEditor listId={listId} />
      </Suspense>
    </PageContent>
  );
}

function ListPageEditor({ listId }: { listId: string }) {
  const list = hooks.useList(listId);

  if (!list) {
    return <div>List not found</div>;
  }

  return <ListEditor list={list} />;
}

export default ListPage;
