import { Suspense } from 'react';
import { client } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';
import { ProductsGrid, ProductsGridSkeleton } from './page.client';

type PageProps = {
  params: Promise<{ categorySlugs?: string[]; storeSlug: string }>;
  searchParams: Promise<{ queryTag?: string; search?: string }>;
};

export default async function PublicStoreCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { categorySlugs, storeSlug } = await params;
  const { queryTag, search } = await searchParams;
  const categorySlug = categorySlugs?.[0];
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(
    client.products.public.getAllByCategorySlug.queryOptions({
      input: { categorySlug, storeSlug, queryTag, search },
    })
  );

  queryClient.prefetchQuery(
    client.tags.public.getAllByStoreSlug.queryOptions({
      input: { storeSlug },
    })
  );

  return (
    <HydrateClient client={queryClient}>
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid />
      </Suspense>
    </HydrateClient>
  );
}
