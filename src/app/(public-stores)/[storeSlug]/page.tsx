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

  const store = await safe(client.stores.getBySlug.call({ slug: storeSlug }));

  if (!store) {
    return notFound();
  }

  return <div>Public Store Page</div>;
}
