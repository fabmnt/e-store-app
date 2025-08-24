import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { UpdateStoreForm } from '@/features/stores/components/update-store-form';
import { client } from '@/lib/orpc';

type UpdateStorePageProps = {
  params: Promise<{
    storeId: string;
  }>;
};

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const { storeId } = await params;
  const {
    data: store,
    error,
    isDefined,
  } = await safe(client.stores.getById.call({ id: storeId }));

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    if (isDefined && error.code === 'NOT_FOUND') {
      notFound();
    }

    throw error;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Update Store</h1>
          <p className="text-muted-foreground text-sm">
            Update information about your store
          </p>
        </div>
      </div>
      <Card>
        <CardContent>
          <UpdateStoreForm store={store} />
        </CardContent>
      </Card>
    </div>
  );
}
