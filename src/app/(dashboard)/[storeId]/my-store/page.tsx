import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { client } from '@/lib/orpc';

type StorePageProps = {
  params: Promise<{
    storeId: string;
  }>;
};

export default async function StorePage({ params }: StorePageProps) {
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
      <div>
        <h1 className="font-bold text-2xl">{store.name}</h1>
        <p className="text-muted-foreground text-sm">
          See and update information about your store
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
            <CardDescription>Name of your store</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{store.slug}</CardTitle>
            <CardDescription>Slug of your store</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
