'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { client } from '@/lib/orpc';
import { Container } from './container';
import { WhatsApp } from './icons/whatsapp';
import { Button } from './ui/button';

export function Header() {
  const { storeSlug } = useParams();
  const { data: store } = useSuspenseQuery(
    client.stores.public.getBySlug.queryOptions({
      input: {
        slug: storeSlug as string,
      },
    })
  );

  const logoImage = store.images.find((image) => image.type === 'logo');

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
              <Link href={`/s/${storeSlug}/categories`}>Categorías</Link>
              <Link href={`/s/${storeSlug}/orders`}>Ofertas</Link>
              <Link href={`/s/${storeSlug}/orders`}>Contacto</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end">
            <Button variant="ghost">
              <WhatsApp className="size-6" />
            </Button>
            <Button variant="ghost">
              <ShoppingCart className="size-6 text-primary" />
            </Button>
          </div>
        </header>
      </Container>
    </div>
  );
}
