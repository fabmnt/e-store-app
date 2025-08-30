'use client';

import { SearchIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  });

  return (
    <div className="relative">
      <Input
        className="peer h-10 w-full rounded-full ps-9 pe-9 xl:w-80"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Busca un producto"
        type="search"
        value={search}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  );
}
