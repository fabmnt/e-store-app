'use client';

import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useShoppingCart } from '@/features/shopping-cart/hooks/use-shopping-cart';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ProductWithImages } from '../schemas/product-schema';

type ProductCardProps = {
  product: ProductWithImages;
};

export function ProductCardMobile({ product }: ProductCardProps) {
  const firstImageUrl = product.images[0]?.url ?? '';
  const addItem = useShoppingCart((state) => state.addItem);
  const items = useShoppingCart((state) => state.items);
  const isInCart = items.some((item) => item.product.id === product.id);
  const removeItem = useShoppingCart((state) => state.removeItem);
  const getItemByProductId = (productId: string) =>
    items.find((item) => item.product.id === productId);

  return (
    <Link href={`/s/${product.store.slug}/products/${product.slug}`}>
      <div className="h-full space-y-1">
        <Card className="rounded-none p-0 md:p-4">
          <CardContent className="h-full p-0 md:p-4">
            <div className="flex h-full flex-col gap-y-3">
              <div className="flex flex-col gap-y-2">
                <div className="relative aspect-square h-[200px] w-full">
                  {firstImageUrl && (
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      priority
                      sizes="200px"
                      src={firstImageUrl}
                    />
                  )}
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-y-2">
                <div className="flex flex-col items-center gap-y-2 px-1">
                  <div className="flex flex-col gap-y-2">
                    <h4 className="text-center font-semibold">
                      {product.name}
                    </h4>
                    <div className="flex flex-wrap items-center justify-center gap-2 font-light">
                      {product.tags.map((tag) => (
                        <Badge
                          className="text-xs"
                          key={tag.id}
                          variant="outline"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  {isInCart ? (
                    <Button
                      className="w-full rounded-none border-x-0 border-b-0 text-muted-foreground text-xs md:w-fit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(getItemByProductId(product.id)?.id ?? '');
                        toast.success('Producto eliminado del carrito');
                      }}
                      size="lg"
                      variant="outline"
                    >
                      Eliminar del carrito
                      <X className="size-5" strokeWidth={1.5} />
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-none border-x-0 border-b-0 text-muted-foreground text-xs md:w-fit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          id: uuidv4(),
                          quantity: 1,
                          product,
                        });
                        toast.success('Producto agregado al carrito');
                      }}
                      size="lg"
                      variant="outline"
                    >
                      Añadir al carrito
                      <ShoppingCart className="size-5" strokeWidth={1.5} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImageUrl = product.images[0]?.url ?? '';
  const addItem = useShoppingCart((state) => state.addItem);
  const items = useShoppingCart((state) => state.items);
  const isInCart = items.some((item) => item.product.id === product.id);
  const isMobile = useIsMobile();

  return (
    <div className="h-full space-y-1">
      <Card className="h-full rounded-none p-0 md:p-4">
        <CardContent className="h-full p-0 md:p-4">
          <div className="flex h-full flex-col gap-y-3">
            <div className="flex flex-col gap-y-2">
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
              </AspectRatio>
            </div>
            <div className="mt-auto flex flex-col gap-y-2">
              <div className="flex flex-col items-center gap-y-2 md:flex-row md:justify-between">
                <div className="flex flex-col gap-y-2">
                  <h4 className="line-clamp-2 text-center font-medium text-sm md:text-left">
                    {product.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 font-light">
                    {product.tags.map((tag) => (
                      <Badge className="text-xs" key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2">
                {!isMobile && (
                  <Button asChild className="flex-1 rounded-sm" size="lg">
                    <Link
                      href={`/s/${product.store.slug}/products/${product.slug}`}
                    >
                      Ver Producto
                    </Link>
                  </Button>
                )}
                {isInCart ? null : (
                  <Button
                    className="w-full md:w-fit"
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
