import { safe } from '@orpc/server';
import { notFound, redirect } from 'next/navigation';
import { CategoriesTable } from '@/features/categories/components/categories-table';
import { client } from '@/lib/orpc';

type CategoriesPageProps = {
  params: Promise<{ storeSlug: string }>;
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { storeSlug } = await params;
  const {
    data: categories,
    error,
    isDefined,
  } = await safe(client.categories.getAllByStoreSlug.call({ storeSlug }));

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
      <div>
        <h1 className="font-bold text-2xl">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage your categories here.
        </p>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
