import { safe } from '@orpc/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
import { ProductCard } from '@/features/products/components/product-card';
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
  } = await safe(client.stores.public.getBySlug.call({ slug: storeSlug }));

  if (error) {
    if (isDefined && error.code === 'NOT_FOUND') {
      return notFound();
    }

    throw error;
  }

  const logoImage = store.images.find((image) => image.type === 'logo');

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-50 border-b bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <header>
            <Image
              alt={store.name}
              className="rounded-full object-cover"
              height={100}
              src={logoImage?.url ?? ''}
              width={100}
            />
          </header>
        </Container>
      </div>
      <div className="text-center">
        <h1 className="font-semibold text-2xl capitalize tracking-wide">
          {store.name}
        </h1>
        <p className="text-muted-foreground">{store.description}</p>
      </div>
      <section className="flex justify-center">
        <CategoriesNavigation categories={store.categories} />
      </section>
      <Container>
        <div className="flex gap-x-4">
          <Button asChild className="rounded-full px-8">
            <Link href={'/'}>Popular</Link>
          </Button>
          <Button asChild className="rounded-full px-8" variant="ghost">
            <Link href={'/'}>Most recent</Link>
          </Button>
        </div>
      </Container>
      <Container>
        <section>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsWrapper storeId={store.id} />
          </Suspense>
        </section>
      </Container>
    </div>
  );
}

async function ProductsWrapper({ storeId }: { storeId: string }) {
  const products = await client.products.public.getAllByStoreId.call({
    storeId,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
