import { safe } from '@orpc/server';
import { notFound } from 'next/navigation';
import { client } from '@/lib/orpc';

type PublicStorePageProps = {
  params: Promise<{ storeSlug: string }>;
};

export default async function PublicStorePage({
  params,
}: PublicStorePageProps) {
  const { storeSlug } = await params;

  const {
    data: store,
    error,
    isDefined,
  } = await safe(client.stores.getBySlug.call({ slug: storeSlug }));

  if (error) {
    if (isDefined && error.code === 'NOT_FOUND') {
      return notFound();
    }

    throw error;
  }

  return (
    <div>
      <div className="space-y-3 py-6 text-center">
        <h1 className="font-semibold text-2xl capitalize tracking-wide">
          {store.name}
        </h1>
        <p className="text-muted-foreground">{store.description}</p>
      </div>
    </div>
  );
}
