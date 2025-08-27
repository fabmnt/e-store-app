import { safe } from '@orpc/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/features/products/components/product-carousel';
import { client } from '@/lib/orpc';

type PageProps = {
  params: Promise<{ storeSlug: string; productSlug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { storeSlug, productSlug } = await params;

  const {
    data: product,
    error,
    isDefined,
  } = await safe(
    client.products.public.getBySlug.call({ storeSlug, productSlug })
  );

  if (error) {
    if (isDefined && error.code === 'NOT_FOUND') {
      return notFound();
    }
    throw error;
  }

  return (
    <div className="grid grid-cols-1 gap-16 py-8 md:grid-cols-2">
      <div className="w-full">
        <ProductCarousel product={product} />
      </div>

      <div className="flex flex-col gap-4 self-start">
        <div>
          <h1 className="font-semibold text-3xl">{product.name}</h1>
          {product.category ? (
            <p className="text-muted-foreground">
              Categoría: {product.category.name}
            </p>
          ) : null}
        </div>

        {product.description ? (
          <p className="text-muted-foreground leading-7">
            {product.description}
          </p>
        ) : (
          <p className="text-muted-foreground">Sin descripción.</p>
        )}

        <div className="mt-2">
          <p className="font-bold text-2xl">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
            }).format(product.price)}
          </p>
          <p className="text-muted-foreground text-sm">
            Stock: {product.stock}
          </p>
        </div>

        <div className="mt-4">
          <Button className="w-full md:w-auto" size="lg">
            Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
