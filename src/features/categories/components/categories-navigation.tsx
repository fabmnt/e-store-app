import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '../schemas/category-schema';

type CategoriesNavigationProps = {
  categories: Category[];
};

export function CategoriesNavigation({
  categories,
}: CategoriesNavigationProps) {
  return (
    <nav className="flex items-center gap-x-6">
      <Button
        className="relative rounded-none px-10 py-5 font-semibold tracking-tight transition-all hover:font-semibold"
        variant="ghost"
      >
        <span>Todos</span>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
      </Button>
      {categories.map((category) => (
        <Button
          className={cn(
            'relative rounded-none px-10 py-5 tracking-tight transition-all hover:font-semibold'
          )}
          key={category.id}
          variant="ghost"
        >
          <span>{category.name}</span>
        </Button>
      ))}
    </nav>
  );
}
