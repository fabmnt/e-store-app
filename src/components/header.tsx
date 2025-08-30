'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShoppingCart } from '@/features/shopping-cart/hooks/use-shopping-cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { client } from '@/lib/orpc';
import { Container } from './container';
import { WhatsApp } from './icons/whatsapp';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

export function Header() {
  const isMobile = useIsMobile();
  const items = useShoppingCart((state) => state.items);
  const total = useShoppingCart((state) => state.total);
  const removeItem = useShoppingCart((state) => state.removeItem);
  const { storeSlug } = useParams();
  const { data: store } = useSuspenseQuery(
    client.stores.public.getBySlug.queryOptions({
      input: {
        slug: storeSlug as string,
      },
    })
  );

  const logoImage = store.images.find((image) => image.type === 'logo');
  const whatsappText = `Hola, quiero comprar los siguientes productos: ${items.map((item) => item.product.name).join(', ')}`;

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <header className="flex items-center">
          <div className="flex-1">
            <Link href={`/s/${storeSlug}/`}>
              <div className="flex items-center gap-4">
                <div className="relative size-[40px] overflow-hidden rounded-full">
                  {logoImage && (
                    <Image
                      alt={store.name}
                      className="object-cover"
                      fill
                      priority
                      sizes="100px"
                      src={logoImage.url}
                    />
                  )}
                </div>
                <span className="font-medium text-sm">{store.name}</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="flex items-center gap-4 text-sm">
              <Link href={`/s/${storeSlug}/categories`}>Categorías</Link>
              <Link href={`/s/${storeSlug}/orders`}>Ofertas</Link>
              <Link href={`/s/${storeSlug}/orders`}>Contacto</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end">
            <Button asChild variant="ghost">
              <Link
                href={`https://wa.me/${store.whatsapp ?? ''}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsApp className="size-6" />
              </Link>
            </Button>
            <Drawer direction={isMobile ? 'bottom' : 'right'}>
              <DrawerTrigger asChild>
                <Button className="relative" variant="ghost">
                  <ShoppingCart className="size-6 text-primary" />
                  {items.length > 0 && (
                    <span className="-right-2 -top-2 absolute block size-4 rounded-full bg-primary text-white text-xs">
                      {items.length}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Carrito</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <ShoppingCart className="size-10" />
                      <span className="text-muted-foreground text-sm">
                        No hay productos en el carrito
                      </span>
                    </div>
                  )}
                  <div className="flex max-h-[500px] flex-col overflow-y-auto">
                    {items.map((item) => (
                      <Link
                        className="flex w-full items-center justify-between gap-2 px-2 py-6 hover:bg-muted/40"
                        href={`/s/${storeSlug}/products/${item.product.slug}`}
                        key={item.id}
                      >
                        {item.product.images[0]?.url ? (
                          <Image
                            alt={item.product.name}
                            className="rounded-md"
                            height={100}
                            src={item.product.images[0]?.url ?? ''}
                            width={100}
                          />
                        ) : (
                          <div className="h-[100px] w-[100px] rounded-md bg-muted" />
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm">
                              {item.product.name}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {item.product.price}
                            </span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            size="icon"
                            variant="ghost"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                {items.length > 0 && (
                  <DrawerFooter>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-2xl">Total </span>
                        <span className="font-semibold text-2xl">
                          {total.toFixed(2)}
                        </span>
                      </div>
                      <Button asChild className="w-full py-6 text-lg" size="lg">
                        <Link
                          href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Comprar productos <WhatsApp className="size-6" />
                        </Link>
                      </Button>
                    </div>
                  </DrawerFooter>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </header>
      </Container>
    </div>
  );
}
