import { safe } from '@orpc/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { StoreCard } from '@/features/stores/components/store-card';
import { client } from '@/lib/orpc';

export default async function Home() {
  const {
    data: stores,
    error,
    isDefined,
  } = await safe(client.stores.protected.getAll.call());

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    throw error;
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4 px-4 py-10 sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Stores</h1>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stores?.map((store) => (
          <Link href={`/d/${store.id}/my-store`} key={store.id}>
            <StoreCard key={store.id} store={store} />
          </Link>
        ))}
      </div>
    </div>
  );
}
