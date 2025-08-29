'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { WhatsApp } from '@/components/icons/whatsapp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShoppingCart } from '@/features/shopping-cart/hooks/use-shopping-cart';
import { client } from '@/lib/orpc';

export function ProductDetails() {
  const addItem = useShoppingCart((state) => state.addItem);
  const items = useShoppingCart((state) => state.items);
  const { storeSlug, productSlug } = useParams();
  const { data: product } = useSuspenseQuery(
    client.products.public.getBySlug.queryOptions({
      input: {
        storeSlug: storeSlug as string,
        productSlug: productSlug as string,
      },
    })
  );
  const isInCart = items.some((item) => item.product.id === product.id);

  const text = `¡Hola! Me interesa el producto **${product.name}**`;

  return (
    <div className="flex h-full w-full flex-col gap-4 self-start">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Button asChild className="px-0" variant="link">
          <Link className="" href={`/s/${storeSlug}/${product.category?.slug}`}>
            {product.category?.name}
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl">{product.name}</h1>
          <div className="flex items-center gap-2">
            {product.tags.map((tag) => (
              <Badge className="px-4 text-sm" key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {product.description ? (
        <p className="text-neutral-800 leading-7">{product.description}</p>
      ) : (
        <p className="text-neutral-700">Sin descripción.</p>
      )}

      {product.details && product.details.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">Detalles</h2>
          <ul className="list-inside list-disc text-neutral-700">
            {product.details?.map((detail) => (
              <li key={detail.id}>{detail.content}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2">
        <p className="font-bold text-3xl text-primary">
          {product.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-auto flex w-full flex-col gap-2">
        <Button asChild className="w-full py-6 text-lg" size="lg">
          <Link
            href={`https://wa.me/${product.store.whatsapp ?? ''}?text=${encodeURIComponent(
              text
            )}`}
          >
            Comprar ahora <WhatsApp className="size-6" />
          </Link>
        </Button>
        <div>
          {isInCart ? null : (
            <Button
              className="w-full py-6 text-lg"
              onClick={() => {
                addItem({ id: product.id, quantity: 1, product });
                toast.success('Producto agregado al carrito');
              }}
              size="lg"
              variant="outline"
            >
              Agregar al carrito <ShoppingCart className="size-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
