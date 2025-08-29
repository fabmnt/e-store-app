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
    <div className="flex w-full flex-col items-center justify-center gap-y-2">
      <h1 className="text-center font-semibold text-2xl tracking-wide">
        {store.name}
      </h1>
      <p className="text-center text-muted-foreground">{store.description}</p>
    </div>
  );
}
