import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';
import { StoreImageActions } from './store-image-actions';

type StoreImagesGridProps = {
  storeImages: StoreImage[];
};

export function StoreImagesGrid({ storeImages }: StoreImagesGridProps) {
  return (
    <div className="grid grid-cols-1 place-items-center gap-4 lg:grid-cols-3">
      {storeImages.map((storeImage, index) => (
        <AspectRatio
          className="relative mx-auto w-[300px]"
          key={storeImage.id}
          ratio={1}
        >
          <div className="absolute top-2 right-2 z-10">
            <StoreImageActions storeImageId={storeImage.id} />
          </div>
          <Image
            alt={`Image ${index + 1}`}
            className="object-cover"
            fill
            key={storeImage.id}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={storeImage.url}
          />
          {storeImage.type && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge className="uppercase">{storeImage.type}</Badge>
            </div>
          )}
        </AspectRatio>
      ))}
    </div>
  );
}
