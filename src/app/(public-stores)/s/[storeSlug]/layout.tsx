import { Container } from '@/components/container';
import { client } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';

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
