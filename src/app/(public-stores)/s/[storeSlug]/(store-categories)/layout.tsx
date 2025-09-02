import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { StickyBackdrop } from '@/components/sticky-backdrop';
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
        <div className="space-y-2">
          <Container>
            <div className="pt-4 pb-2">
              <div className="motion-opacity-in motion-translate-y-in-50 overflow-hidden">
                <StoreHero />
              </div>
            </div>
          </Container>
          <StickyBackdrop className="motion-opacity-in motion-translate-y-in-50 motion-delay-100 sticky top-0 z-10 bg-background">
            <Container>
              <CategoriesNavigation />
            </Container>
          </StickyBackdrop>
          <Container>
            <div className="flex flex-col gap-y-4">
              <div className="motion-opacity-in motion-translate-y-in-50 motion-delay-100 flex w-full flex-col justify-between gap-4 py-2 xl:flex-row">
                <SearchInput />
                <div>
                  <TagsNavigationWrapper />
                </div>
              </div>
            </div>
          </Container>
          <Container>{children}</Container>
          <Header />
        </div>
      </ThemeProvider>
    </div>
  );
}
