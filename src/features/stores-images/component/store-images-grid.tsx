import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';

type StoreImagesGridProps = {
  storeImages: StoreImage[];
};

export function StoreImagesGrid({ storeImages }: StoreImagesGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {storeImages.map((storeImage, index) => (
        <AspectRatio className="w-[300px]" key={storeImage.id} ratio={1}>
          <Image
            alt={`Image ${index + 1}`}
            className="object-cover"
            fill
            key={storeImage.id}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={storeImage.url}
          />
        </AspectRatio>
      ))}
    </div>
  );
}
