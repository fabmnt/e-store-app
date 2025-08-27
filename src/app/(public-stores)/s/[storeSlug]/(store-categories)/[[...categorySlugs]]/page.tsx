'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, use } from 'react';
import { ProductCard } from '@/features/products/components/product-card';
import { client } from '@/lib/orpc';

type PageProps = {
  params: Promise<{ categorySlugs?: string[]; storeSlug: string }>;
};

export default function PublicStoreCategoryPage({ params }: PageProps) {
  const { categorySlugs, storeSlug } = use(params);
  const categorySlug = categorySlugs?.[0];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsGrid categorySlug={categorySlug} storeSlug={storeSlug} />
    </Suspense>
  );
}

function ProductsGrid({
  categorySlug,
  storeSlug,
}: {
  categorySlug: string | undefined;
  storeSlug: string;
}) {
  const { data: products } = useSuspenseQuery(
    client.products.public.getAllByCategorySlug.queryOptions({
      input: {
        categorySlug,
        storeSlug,
      },
    })
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.length === 0 && <div>No products found</div>}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
