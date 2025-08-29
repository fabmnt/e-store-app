import { Container } from '@/components/container';
import { Header } from '@/components/header';
import { CategoriesNavigation } from '@/features/categories/components/categories-navigation';
import { StoreHero } from '@/features/stores/components/store-hero';
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
            <StoreHero />
          </Container>
          <section className="flex justify-center">
            <CategoriesNavigation />
          </section>
          <Container>{children}</Container>
        </div>
      </ThemeProvider>
    </div>
  );
}
