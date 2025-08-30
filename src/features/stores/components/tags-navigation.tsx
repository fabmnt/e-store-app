'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { client } from '@/lib/orpc';

export function TagsNavigation({ storeSlug }: { storeSlug: string }) {
  const [queryTag, setQueryTag] = useQueryState('queryTag', {
    defaultValue: '',
    clearOnDefault: true,
  });

  const { data: tags } = useSuspenseQuery(
    client.tags.public.getAllByStoreSlug.queryOptions({
      input: {
        storeSlug: storeSlug as string,
      },
    })
  );

  return (
    <div
      className="scrollbar-hide max-w-fit overflow-x-auto xl:max-w-[360px]"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <div className="flex items-center gap-4">
        {tags?.map((tag) => (
          <Button
            className="rounded-full px-5 text-xs uppercase tracking-wider"
            key={tag.id}
            onClick={() => setQueryTag(queryTag === tag.id ? '' : tag.id)}
            size="sm"
            variant={queryTag === tag.id ? 'default' : 'outline'}
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function TagsNavigationWrapper() {
  const { storeSlug } = useParams();
  return (
    <Suspense fallback={<TagsNavigationSkeleton />} key={storeSlug as string}>
      <TagsNavigation storeSlug={storeSlug as string} />
    </Suspense>
  );
}

function TagsNavigationSkeleton() {
  return (
    <div className="scrollbar-hide overflow-x-auto xl:max-w-[360px]">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}
