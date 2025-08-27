'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, use } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/features/products/components/product-card';
import { client } from '@/lib/orpc';

type PageProps = {
  params: Promise<{ categorySlugs?: string[]; storeSlug: string }>;
};

export default function PublicStoreCategoryPage({ params }: PageProps) {
  const { categorySlugs, storeSlug } = use(params);
  const categorySlug = categorySlugs?.[0];

  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
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

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static
        <div className="space-y-1" key={index}>
          <Card className="rounded-none">
            <CardContent className="rounded-none">
              <div className="space-y-2">
                <AspectRatio
                  className="mx-auto max-w-[280px] rounded-none xl:max-w-[320px]"
                  ratio={1}
                >
                  <Skeleton className="h-full w-full rounded-none" />
                </AspectRatio>
                <div className="flex justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                  <div className="w-16 shrink-0">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-10 w-full rounded-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
