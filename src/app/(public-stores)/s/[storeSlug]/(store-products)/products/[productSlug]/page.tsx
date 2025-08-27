import { safe } from '@orpc/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
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
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {product.images.length > 0 ? (
              product.images.map((img) => (
                <CarouselItem
                  className="flex items-center justify-center"
                  key={img.id}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={img.url}
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="flex items-center justify-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted" />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
