import { safe } from '@orpc/client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CreateProductDialog } from '@/features/products/components/create-product-dialog';
import { ProductsTable } from '@/features/products/components/products-table';
import { auth } from '@/lib/auth';
import { client } from '@/lib/orpc';

type ProductsPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/signin');
  }

  const { storeSlug } = await params;

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="font-bold text-2xl">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your products here.
          </p>
        </div>
        <CreateProductDialog />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTableWrapper storeSlug={storeSlug} />
      </Suspense>
    </div>
  );
}

async function ProductsTableWrapper({ storeSlug }: { storeSlug: string }) {
  const { data: products, error } = await safe(
    client.products.getAllByStoreSlug.call({ storeSlug })
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ProductsTable products={products} />;
}
