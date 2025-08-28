'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { client } from '@/lib/orpc';

export function StoreHero() {
  const { storeSlug } = useParams();

  const { data: store } = useSuspenseQuery(
    client.stores.public.getBySlug.queryOptions({
      input: {
        slug: storeSlug as string,
      },
    })
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-semibold text-2xl tracking-wide">{store.name}</h1>
      <p className="text-muted-foreground">{store.description}</p>
    </div>
  );
}
