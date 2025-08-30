import { Container } from '@/components/container';
import { Header } from '@/components/header';

type ProductsLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="bg-background [font-family:var(--font-mona-sans)]">
      <Header />
      <Container>{children}</Container>
    </div>
  );
}
