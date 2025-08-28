'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addClickToProductAction } from '@/rpc/products/products-actions';
import type { ProductWithImages } from '../schemas/product-schema';

type ProductCardProps = {
  product: ProductWithImages;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstImageUrl = product.images[0]?.url ?? '';

  return (
    <div className="space-y-1">
      <Card className="rounded-none">
        <CardContent>
          <div className="flex h-[360px] flex-col gap-y-2">
            <AspectRatio
              className="mx-auto max-w-[280px] xl:max-w-[320px]"
              ratio={1}
            >
              {firstImageUrl && (
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={firstImageUrl}
                />
              )}
            </AspectRatio>
            <div className="mt-auto flex flex-col gap-y-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {product.description}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  asChild
                  className="w-full rounded-sm"
                  onClick={() => {
                    addClickToProductAction({ id: product.id });
                  }}
                  size="lg"
                >
                  <Link
                    href={`/s/${product.store.slug}/products/${product.slug}`}
                  >
                    Ver Producto
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
