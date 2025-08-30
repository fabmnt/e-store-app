import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { client } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug } = await params;
  const storeLogo = await client.storeImages.getStoreLogo.call({
    storeSlug,
  });

  console.log({ storeLogo });
  return {
    title: storeSlug,
    icons: {
      icon: [
        {
          rel: 'icon',
          url: storeLogo?.url ?? '',
          type: 'image/jpg',
          sizes: '32x32',
        },
      ],
    },
  };
}

export default async function PublicStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(
    client.stores.public.getBySlug.queryOptions({
      input: {
        slug: storeSlug,
      },
    })
  );

  return (
    <HydrateClient client={queryClient}>
      {children}
      <footer className="mt-4 border-t py-6">
        <Container>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {storeSlug}. Todos los derechos
              reservados.
            </p>
          </div>
        </Container>
      </footer>
    </HydrateClient>
  );
}
