'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WhatsApp } from '@/components/icons/whatsapp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/orpc';

export function ProductDetails() {
  const { storeSlug, productSlug } = useParams();
  const { data: product } = useSuspenseQuery(
    client.products.public.getBySlug.queryOptions({
      input: {
        storeSlug: storeSlug as string,
        productSlug: productSlug as string,
      },
    })
  );
  return (
    <div className="flex h-full w-full flex-col gap-4 self-start">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Badge asChild className="rounded-full px-6" variant="outline">
          <Link href={`/s/${storeSlug}/${product.category?.slug}`}>
            {product.category?.name}
          </Link>
        </Badge>
        <h1 className="font-semibold text-3xl">{product.name}</h1>
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
        <Button className="w-full py-6 text-lg" size="lg">
          Comprar ahora <WhatsApp className="size-6" />
        </Button>
        <Button className="w-full py-6 text-lg" size="lg" variant="outline">
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
}
