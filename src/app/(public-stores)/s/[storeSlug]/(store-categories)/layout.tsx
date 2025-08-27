import { safe } from '@orpc/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
import { client } from '@/lib/orpc';
import { ThemeProvider } from '@/providers/theme-provider';

export default async function PublicStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
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
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem
        forcedTheme="light"
      >
        <div className="space-y-8">
          <Header logoImage={logoImage} store={store} storeSlug={storeSlug} />
          <div className="text-center">
            <h1 className="font-semibold text-2xl capitalize tracking-wide">
              {store.name}
            </h1>
            <p className="text-muted-foreground">{store.description}</p>
          </div>
          <section className="flex justify-center">
            <CategoriesNavigation categories={store.categories} />
          </section>
          <Container>{children}</Container>
        </div>
      </ThemeProvider>
    </div>
  );
}
