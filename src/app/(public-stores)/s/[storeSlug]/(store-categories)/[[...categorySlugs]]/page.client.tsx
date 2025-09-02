'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ProductCard,
  ProductCardMobile,
} from '@/features/products/components/product-card';
import { client } from '@/lib/orpc';

export function ProductsGrid() {
  const { categorySlugs, storeSlug } = useParams();
  const categorySlug = categorySlugs?.[0];
  const [search] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  });
  const [queryTag] = useQueryState('queryTag', {
    defaultValue: '',
    clearOnDefault: true,
  });

  const normalizedQuery = search || undefined;
  const normalizedQueryTag = queryTag || undefined;

  const { data: products } = useSuspenseQuery(
    client.products.public.getAllByCategorySlug.queryOptions({
      input: {
        categorySlug,
        storeSlug: storeSlug as string,
        query: normalizedQuery,
        queryTag: normalizedQueryTag,
      },
    })
  );

  if (products.length === 0) {
    return (
      <div className="py-8 text-center text-xl">
        <Alert className="space-y-2">
          <AlertTitle className="p-6 font-normal text-lg tracking-wide">
            No se encontraron productos
          </AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id}>
          <div className="block md:hidden">
            <ProductCardMobile key={product.id} product={product} />
          </div>
          <div className="hidden md:block">
            <ProductCard key={product.id} product={product} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static
        <div className="space-y-1" key={index}>
          <Card className="rounded-none p-0">
            <CardContent className="space-y-2 rounded-none p-0">
              <Skeleton className="h-[200px] w-full rounded-none" />
              <div className="px-1">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div>
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
