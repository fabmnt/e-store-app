'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { ProductCard } from '@/features/products/components/product-card';
import { client } from '@/lib/orpc';

type PageProps = {
  params: Promise<{ categorySlugs?: string[]; storeSlug: string }>;
};

export default function PublicStoreCategoryPage({ params }: PageProps) {
  const { categorySlugs, storeSlug } = use(params);
  const categorySlug = categorySlugs?.[0];

  const { data: products, isLoading } = useQuery(
    client.products.public.getAllByCategorySlug.queryOptions({
      input: {
        categorySlug,
        storeSlug,
      },
    })
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products?.length) {
    return <div>No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
