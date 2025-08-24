import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';

export function UploadProductImages({
  productId,
  storeSlug,
}: {
  productId: string;
  storeSlug: string;
}) {
  return (
    <UploadButton
      appearance={{
        button: buttonVariants({ variant: 'outline' }),
      }}
      config={{
        mode: 'manual',
      }}
      endpoint="imageUploader"
      input={{
        productId,
        storeSlug,
      }}
      onClientUploadComplete={() => {
        toast.success('Images uploaded successfully');
      }}
      onUploadError={() => {
        toast.error('Failed to upload images');
      }}
    />
  );
}
