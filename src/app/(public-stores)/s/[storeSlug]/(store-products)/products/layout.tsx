import { Container } from '@/components/container';
import { Header } from '@/components/header';
import ScrollToTop from '@/components/scroll-restoration';

type ProductsLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="bg-background [font-family:var(--font-mona-sans)]">
      <ScrollToTop />
      <Header />
      <Container>{children}</Container>
    </div>
  );
}
