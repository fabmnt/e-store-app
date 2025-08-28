import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@/features/stores/schemas/store-schema';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';
import { Container } from './container';
import { WhatsApp } from './icons/whatsapp';
import { Button } from './ui/button';

type HeaderProps = {
  storeSlug: string;
  store: Store;
  logoImage?: StoreImage;
};

export function Header({ storeSlug, store, logoImage }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <header className="flex items-center">
          <div className="flex-1">
            <Link href={`/s/${storeSlug}/`}>
              <div className="flex items-center gap-4">
                <div className="relative size-[40px] overflow-hidden rounded-full">
                  <Image
                    alt={store.name}
                    className="object-cover"
                    fill
                    priority
                    sizes="100px"
                    src={logoImage?.url ?? ''}
                  />
                </div>
                <span className="font-medium text-sm">{store.name}</span>
              </div>
            </Link>
          </div>
          <div className="">
            <nav className="flex items-center gap-4 text-sm">
              <Link href={`/s/${storeSlug}/products`}>Productos</Link>
              <Link href={`/s/${storeSlug}/categories`}>Categorías</Link>
              <Link href={`/s/${storeSlug}/orders`}>Pedidos</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end">
            <Button size="icon" variant="ghost">
              <WhatsApp />
            </Button>
            <Button size="icon" variant="ghost">
              <ShoppingCart />
            </Button>
          </div>
        </header>
      </Container>
    </div>
  );
}
