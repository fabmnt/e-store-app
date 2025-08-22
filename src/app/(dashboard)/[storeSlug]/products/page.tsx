import { safe } from '@orpc/client';
import { notFound, redirect } from 'next/navigation';
import { client } from '@/lib/orpc';

type ProductsPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { storeSlug } = await params;
  const {
    error,
    data: products,
    isDefined,
  } = await safe(client.products.getAllByStoreSlug({ storeSlug }));

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    if (isDefined && error.code === 'NOT_FOUND') {
      return notFound();
    }

    return <div>Error: {error.message}</div>;
  }

  return <div>{JSON.stringify(products)}</div>;
}
