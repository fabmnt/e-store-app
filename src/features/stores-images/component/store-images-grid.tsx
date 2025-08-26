import Image from 'next/image';
import type { StoreImage } from '@/features/stores-images/schemas/store-image-schema';

type StoreImagesGridProps = {
  storeImages: StoreImage[];
};

export function StoreImagesGrid({ storeImages }: StoreImagesGridProps) {
  return (
    <div className="">
      {storeImages.map((storeImage, index) => (
        <Image
          alt={`Image ${index + 1}`}
          className="h-[300px]"
          height={300}
          key={storeImage.id}
          src={storeImage.url}
          width={300}
        />
      ))}
    </div>
  );
}
