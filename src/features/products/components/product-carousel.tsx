'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { client } from '@/lib/orpc';
import { cn } from '@/lib/utils';

export function ProductCarousel() {
  const { storeSlug, productSlug } = useParams();
  const { data: product } = useSuspenseQuery(
    client.products.public.getBySlug.queryOptions({
      input: {
        storeSlug: storeSlug as string,
        productSlug: productSlug as string,
      },
    })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col gap-4">
      <Carousel
        className="relative w-full"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {product.images.length > 0 ? (
            product.images.map((img) => (
              <CarouselItem
                className="group flex items-center justify-center"
                key={img.id}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={img.url}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="flex items-center justify-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted" />
            </CarouselItem>
          )}
        </CarouselContent>
        {count > 1 && <CarouselPrevious className="hidden md:flex" />}
        {count > 1 && <CarouselNext className="hidden md:flex" />}
      </Carousel>
      <div className="flex items-center justify-center gap-2">
        {product.images.map((img, index) => (
          <button
            className={cn(
              'relative aspect-square h-auto w-[100px] rounded-md border-2 border-transparent p-2 hover:border-neutral-300',
              index + 1 === current && 'border-neutral-300'
            )}
            key={img.id}
            onClick={() => api?.scrollTo(index)}
            type="button"
          >
            <Image
              alt={product.name}
              className="rounded object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={img.url}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
