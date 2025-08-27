'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '../schemas/category-schema';

type CategoriesNavigationProps = {
  categories: Category[];
};

export function CategoriesNavigation({
  categories,
}: CategoriesNavigationProps) {
  const { storeSlug } = useParams();
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-x-2 xl:gap-x-6">
      <Button
        asChild
        className={cn(
          'relative rounded-none px-5 py-5 tracking-tight transition-all hover:font-semibold xl:px-10',
          pathname === `/s/${storeSlug}` && 'font-semibold'
        )}
        variant="ghost"
      >
        <Link href={`/s/${storeSlug}/`}>
          <span>Todos</span>
          {pathname === `/s/${storeSlug}` && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
          )}
        </Link>
      </Button>
      {categories.map((category) => (
        <Button
          asChild
          className={cn(
            'relative rounded-none px-5 py-5 tracking-tight transition-all hover:font-semibold xl:px-10'
          )}
          key={category.id}
          variant="ghost"
        >
          <Link
            className={cn(
              pathname === `/s/${storeSlug}/${category.slug}` && 'font-semibold'
            )}
            href={`/s/${storeSlug}/${category.slug}`}
          >
            <span>{category.name}</span>
            {pathname === `/s/${storeSlug}/${category.slug}` && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
            )}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
