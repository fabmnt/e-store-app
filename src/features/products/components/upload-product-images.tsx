import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { revalidatePathAction } from '@/server/actions';

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
      onClientUploadComplete={async () => {
        toast.success('Images uploaded successfully');
        await revalidatePathAction(`/${storeSlug}/products`);
      }}
      onUploadError={() => {
        toast.error('Failed to upload images');
      }}
    />
  );
}
