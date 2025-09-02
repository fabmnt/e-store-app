'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/orpc';
import { cn } from '@/lib/utils';

export function CategoriesNavigation() {
  const { storeSlug } = useParams();
  const pathname = usePathname();
  const { data: store } = useSuspenseQuery(
    client.stores.public.getBySlug.queryOptions({
      input: {
        slug: storeSlug as string,
      },
    })
  );
  const categories = store.categories;

  return (
    <div className="">
      <nav
        className="flex max-w-[360px] items-center gap-x-4 overflow-x-auto xl:max-w-fit xl:gap-x-6"
        style={{
          scrollbarWidth: 'none',
        }}
      >
        <Button
          asChild
          className={cn('relative px-5 py-5 tracking-tight xl:px-10')}
          variant={pathname === `/s/${storeSlug}` ? 'default' : 'secondary'}
        >
          <Link href={`/s/${storeSlug}/`}>
            <span>Todos</span>
          </Link>
        </Button>
        {categories.map((category) => (
          <Button
            asChild
            className={cn('relative px-5 py-5 tracking-tight xl:px-10')}
            key={category.id}
            variant={
              pathname === `/s/${storeSlug}/${category.slug}`
                ? 'default'
                : 'secondary'
            }
          >
            <Link href={`/s/${storeSlug}/${category.slug}`}>
              <span>{category.name}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
