import { SearchIcon } from 'lucide-react';
import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
import { StoreHero } from '@/features/stores/components/store-hero';
import { TagsNavigationWrapper } from '@/features/stores/components/tags-navigation';
import { ThemeProvider } from '@/providers/theme-provider';

export default function PublicStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background [font-family:var(--font-mona-sans)]">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem
        forcedTheme="light"
      >
        <div className="space-y-8">
          <Header />
          <Container>
            <div className="motion-opacity-in motion-translate-y-in-50 overflow-hidden">
              <StoreHero />
            </div>
          </Container>
          <Container>
            <div className="motion-opacity-in motion-translate-y-in-50 motion-delay-100 flex flex-col gap-y-4 overflow-hidden">
              <section className="flex justify-center">
                <CategoriesNavigation />
              </section>
              <div className="flex w-full flex-col justify-between gap-4 py-2 xl:flex-row">
                <div className="relative">
                  <Input
                    className="peer h-10 w-full rounded-full ps-9 pe-9 xl:w-80"
                    placeholder="Busca un producto"
                    type="search"
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                  </div>
                </div>
                <div>
                  <TagsNavigationWrapper />
                </div>
              </div>
            </div>
          </Container>
          <Container>{children}</Container>
        </div>
      </ThemeProvider>
    </div>
  );
}
