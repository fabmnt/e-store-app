import { ProductCarousel } from '@/features/products/components/product-carousel';
import { ProductDetails } from '@/features/products/components/product-details';
import { client } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';

type PageProps = {
  params: Promise<{ storeSlug: string; productSlug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { storeSlug, productSlug } = await params;

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(
    client.products.public.getBySlug.queryOptions({
      input: { storeSlug, productSlug },
    })
  );

  return (
    <HydrateClient client={queryClient}>
      <div className="grid w-full grid-cols-1 gap-16 py-8 md:grid-cols-2">
        <div className="w-full">
          <ProductCarousel />
        </div>
        <ProductDetails />
      </div>
    </HydrateClient>
  );
}
