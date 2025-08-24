'use client';

import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import type { Store } from '@/features/stores/schemas/store-schema';
import { UploadButton } from '@/lib/uploadthing';

type UploadStoreImageProps = {
  store: Store;
};

export function UploadStoreImage({ store }: UploadStoreImageProps) {
  return (
    <UploadButton
      appearance={{
        button: buttonVariants({ variant: 'outline' }),
      }}
      endpoint="storeImageUploader"
      input={{ storeId: store.id }}
      onClientUploadComplete={() => {
        toast.success('Images uploaded successfully');
      }}
    />
  );
}
