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
      {categories.map((category, i) => (
        <Button
          className="relative rounded-none px-10 py-5 tracking-tight"
          key={category.id}
          variant="ghost"
        >
          <span>{category.name}</span>
          {i === 0 && (
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
          )}
        </Button>
      ))}
    </nav>
  );
}
