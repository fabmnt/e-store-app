import { safe } from '@orpc/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
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
    <div className="space-y-8">
      <div className="space-y-2 py-2 text-center">
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
    </div>
  );
}
