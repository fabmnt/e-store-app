'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useShoppingCart } from '@/features/shopping-cart/hooks/use-shopping-cart';
import { addClickToProductAction } from '@/rpc/products/products-actions';
import type { ProductWithImages } from '../schemas/product-schema';

type ProductCardProps = {
  product: ProductWithImages;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstImageUrl = product.images[0]?.url ?? '';
  const addItem = useShoppingCart((state) => state.addItem);
  const items = useShoppingCart((state) => state.items);
  const isInCart = items.some((item) => item.product.id === product.id);

  return (
    <div className="space-y-1">
      <Card className="rounded-none">
        <CardContent>
          <div className="flex flex-col gap-y-4 xl:h-[360px]">
            <AspectRatio
              className="relative mx-auto w-full xl:max-w-[320px]"
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
              <div className="absolute right-2 bottom-2 flex items-center gap-2 font-light">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </AspectRatio>
            <div className="mt-auto flex flex-col gap-y-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="max-w-[25ch] truncate text-muted-foreground text-sm xl:max-w-[20ch]">
                    {product.description}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <Button
                  asChild
                  className="flex-1 rounded-sm"
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
                {isInCart ? null : (
                  <Button
                    onClick={() => {
                      addItem({
                        id: crypto.randomUUID(),
                        quantity: 1,
                        product,
                      });
                      toast.success('Producto agregado al carrito');
                    }}
                    size="lg"
                    variant="outline"
                  >
                    <ShoppingCart className="size-5" strokeWidth={1.5} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
