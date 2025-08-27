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
    <nav className="flex items-center gap-x-6">
      <Button
        asChild
        className={cn(
          'relative rounded-none px-10 py-5 tracking-tight transition-all hover:font-semibold',
          pathname === `/${storeSlug}` && 'font-semibold'
        )}
        variant="ghost"
      >
        <Link href={`/${storeSlug}/`}>
          <span>Todos</span>
          {pathname === `/${storeSlug}` && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
          )}
        </Link>
      </Button>
      {categories.map((category) => (
        <Button
          asChild
          className={cn(
            'relative rounded-none px-10 py-5 tracking-tight transition-all hover:font-semibold'
          )}
          key={category.id}
          variant="ghost"
        >
          <Link
            className={cn(
              pathname === `/${storeSlug}/${category.slug}` && 'font-semibold'
            )}
            href={`/${storeSlug}/${category.slug}`}
          >
            <span>{category.name}</span>
            {pathname === `/${storeSlug}/${category.slug}` && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
            )}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
