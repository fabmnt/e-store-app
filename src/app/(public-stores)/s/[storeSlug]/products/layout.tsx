import { safe } from '@orpc/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { client } from '@/lib/orpc';

type ProductsLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
};

export default async function ProductsLayout({
  children,
  params,
}: ProductsLayoutProps) {
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
    <div className="bg-background [font-family:var(--font-mona-sans)]">
      <Header logoImage={logoImage} store={store} storeSlug={storeSlug} />
      <Container>{children}</Container>
    </div>
  );
}
