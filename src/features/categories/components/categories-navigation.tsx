import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Category } from '../schemas/category-schema';

type CategoriesNavigationProps = {
  categories: Category[];
};

export function CategoriesNavigation({
  categories,
}: CategoriesNavigationProps) {
  return (
    <nav className="flex items-center gap-x-6">
      {categories.map((category) => (
        <Button
          asChild
          className="rounded-full border border-x-0 border-t-0 border-b-2 px-10 tracking-tight"
          key={category.id}
          variant="outline"
        >
          <Link href={'/'}>{category.name}</Link>
        </Button>
      ))}
    </nav>
  );
}
