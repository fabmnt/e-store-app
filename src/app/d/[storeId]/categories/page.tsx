import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CategoriesTable } from '@/features/categories/components/categories-table';
import { CreateCategoryDialog } from '@/features/categories/components/create-category-dialog';
import { client } from '@/lib/orpc';

type CategoriesPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { storeId } = await params;
  const {
    data: categories,
    error,
    isDefined,
  } = await safe(client.categories.protected.getAllByStoreId.call({ storeId }));

  if (error) {
    if (isDefined && error.code === 'NOT_FOUND') {
      notFound();
    }

    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    throw error;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Manage your categories here.
          </p>
        </div>
        <CreateCategoryDialog />
      </div>
      <Card>
        <CardContent>
          <CategoriesTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
