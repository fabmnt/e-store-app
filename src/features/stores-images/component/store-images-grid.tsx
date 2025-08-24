import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';

type StoreImagesGridProps = {
  storeImages: StoreImage[];
};

export function StoreImagesGrid({ storeImages }: StoreImagesGridProps) {
  return (
    <div className="grid grid-cols-5">
      {storeImages.map((storeImage, index) => (
        <AspectRatio className="size-[320px]" key={storeImage.id} ratio={1 / 1}>
          <Image alt={`Image ${index + 1}`} fill src={storeImage.url} />
        </AspectRatio>
      ))}
    </div>
  );
}
