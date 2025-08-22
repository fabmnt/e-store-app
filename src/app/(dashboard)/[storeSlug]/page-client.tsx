'use client';
import type { Store } from '@/features/stores/schemas/store-schema';

type StorePageClientProps = {
  store: Store;
};

export function StorePageClient({ store }: StorePageClientProps) {
  return <div>{store.name}</div>;
}
