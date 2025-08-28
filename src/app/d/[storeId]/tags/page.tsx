import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CreateTagDialog } from '@/features/tags/components/create-tag-dialog';
import { TagsTable } from '@/features/tags/components/tags-table';
import { client } from '@/lib/orpc';

type TagsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function TagsPage({ params }: TagsPageProps) {
  const { storeId } = await params;
  const {
    data: tags,
    error,
    isDefined,
  } = await safe(client.tags.protected.getAllByStoreId.call({ storeId }));

  if (error) {
    if (isDefined && error.code === 'NOT_FOUND') {
      notFound();
    }
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }
    throw error;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Tags</h1>
          <p className="text-muted-foreground text-sm">
            Manage your tags here.
          </p>
        </div>
        <CreateTagDialog />
      </div>
      <Card>
        <CardContent>
          <TagsTable tags={tags} />
        </CardContent>
      </Card>
    </div>
  );
}
