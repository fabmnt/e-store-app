import { safe } from '@orpc/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
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
          <div className="sticky top-0 z-50 border-b bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
              <header>
                <Link href={`/s/${storeSlug}/`}>
                  <div className="flex items-center gap-4">
                    <div className="relative size-[40px] overflow-hidden rounded-full">
                      <Image
                        alt={store.name}
                        className="object-cover"
                        fill
                        priority
                        sizes="100px"
                        src={logoImage?.url ?? ''}
                      />
                    </div>
                    <span className="font-medium">{store.name}</span>
                  </div>
                </Link>
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
          <Container>{children}</Container>
        </div>
      </ThemeProvider>
    </div>
  );
}
