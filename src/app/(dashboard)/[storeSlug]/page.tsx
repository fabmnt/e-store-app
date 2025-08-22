import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { client } from '@/lib/orpc';
import { StorePageClient } from './page-client';

type StorePageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const {
    data: store,
    error,
    isDefined,
  } = await safe(client.stores.getBySlug({ slug: storeSlug }));

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    if (isDefined && error.code === 'NOT_FOUND') {
      return notFound();
    }

    return <div>Something went wrong</div>;
  }

  return <StorePageClient store={store} />;
}
