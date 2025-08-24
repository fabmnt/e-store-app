import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';
import { revalidatePathAction } from '@/server/actions';

export function UploadProductImages({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) {
  return (
    <UploadButton
      appearance={{
        button: buttonVariants({ variant: 'outline' }),
      }}
      config={{
        mode: 'manual',
      }}
      endpoint="productImageUploader"
      input={{
        productId,
        storeId,
      }}
      onClientUploadComplete={async () => {
        toast.success('Images uploaded successfully');
        await revalidatePathAction(`/d/${storeId}/products`);
      }}
      onUploadError={() => {
        toast.error('Failed to upload images');
      }}
    />
  );
}
