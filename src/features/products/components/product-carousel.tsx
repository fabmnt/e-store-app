'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { ProductWithImages } from '../schemas/product-schema';

type ProductCarouselProps = {
  product: ProductWithImages;
};

export function ProductCarousel({ product }: ProductCarouselProps) {
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
    <Carousel className="relative w-full" opts={{ loop: true }} setApi={setApi}>
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
      {current > 1 && <CarouselPrevious className="hidden md:flex" />}
      {current < count && <CarouselNext className="hidden md:flex" />}
    </Carousel>
  );
}
