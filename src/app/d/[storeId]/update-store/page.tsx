import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpdateStoreForm } from '@/features/stores/components/update-store-form';
import { StoreImagesGrid } from '@/features/stores-images/component/store-images-grid';
import { UploadStoreImage } from '@/features/stores-images/component/upload-store-image';
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
  } = await safe(client.stores.protected.getById.call({ id: storeId }));

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
        <Tabs defaultValue="update-details">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="update-details">Update details</TabsTrigger>
              <TabsTrigger value="update-images">Update images</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="update-details">
              <UpdateStoreForm store={store} />
            </TabsContent>
            <TabsContent value="update-images">
              <div className="flex flex-col gap-4">
                <Suspense fallback={<div>Loading images...</div>}>
                  <StoreImagesWrapper storeId={store.id} />
                </Suspense>
                <UploadStoreImage store={store} />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

async function StoreImagesWrapper({ storeId }: { storeId: string }) {
  const { data: storeImages, error } = await safe(
    client.storeImages.getAllByStoreId.call({ storeId })
  );

  if (error) {
    return <div>Couldn't get store images</div>;
  }

  return <StoreImagesGrid storeImages={storeImages ?? []} />;
}
