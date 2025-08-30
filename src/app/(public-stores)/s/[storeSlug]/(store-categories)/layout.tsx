import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
import { SearchInput } from '@/features/products/components/search-input';
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
            <div className="motion-opacity-in motion-translate-y-in-50 motion-delay-100 flex flex-col gap-y-4 overflow-y-hidden">
              <section className="flex justify-center">
                <CategoriesNavigation />
              </section>
              <div className="flex w-full flex-col justify-between gap-4 py-2 xl:flex-row">
                <SearchInput />
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
