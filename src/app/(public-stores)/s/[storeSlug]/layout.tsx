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

  return <HydrateClient client={queryClient}>{children}</HydrateClient>;
}
