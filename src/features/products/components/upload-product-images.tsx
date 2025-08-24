import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';

export function UploadProductImages({ productId }: { productId: string }) {
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
