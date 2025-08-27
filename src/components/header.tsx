import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@/features/stores/schemas/store-schema';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';
import { Container } from './container';

type HeaderProps = {
  storeSlug: string;
  store: Store;
  logoImage?: StoreImage;
};

export function Header({ storeSlug, store, logoImage }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <header>
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
              <span className="font-medium">{store.name}</span>
            </div>
          </Link>
        </header>
      </Container>
    </div>
  );
}
