import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductWithImages } from '../schemas/product-schema';

type ProductCardProps = {
  product: ProductWithImages;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstImageUrl = product.images[0]?.url ?? '';

  return (
    <div className="space-y-1">
      <Card className="rounded-none">
        <CardContent>
          <div className="space-y-2">
            <AspectRatio className="max-w-[280px]" ratio={1}>
              {firstImageUrl && (
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={firstImageUrl}
                />
              )}
            </AspectRatio>
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-sm">{product.name}</h4>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{product.price}</p>
              </div>
            </div>
            <div>
              <Button className="w-full" size="lg">
                Ver Producto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
