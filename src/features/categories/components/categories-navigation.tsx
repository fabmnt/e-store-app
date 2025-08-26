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
          className="rounded-full px-10 tracking-tight"
          key={category.id}
          variant="outline"
        >
          <Link href={'/'}>{category.name}</Link>
        </Button>
      ))}
    </nav>
  );
}
