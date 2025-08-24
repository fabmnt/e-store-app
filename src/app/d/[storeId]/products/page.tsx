import { safe } from '@orpc/client';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CreateProductDialog } from '@/features/products/components/create-product-dialog';
import { ProductsTable } from '@/features/products/components/products-table';
import { client } from '@/lib/orpc';

type ProductsPageProps = {
  params: Promise<{
    storeId: string;
  }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { storeId } = await params;
  const {
    data: products,
    error,
    isDefined,
  } = await safe(client.products.getAllByStoreId.call({ storeId }));

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    if (isDefined && error.code === 'NOT_FOUND') {
      notFound();
    }

    throw error;
  }

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
      <Card>
        <CardContent>
          <ProductsTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
