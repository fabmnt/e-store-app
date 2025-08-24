import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteProductAction } from '@/orpc/products/products-actions';

type DeleteProductDialogProps = {
  productId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteProductDialog({
  productId,
  open,
  onOpenChange,
}: DeleteProductDialogProps) {
  const { execute: executeDelete, isPending: isDeleting } = useServerAction(
    deleteProductAction,
    {
      interceptors: [
        onSuccess(() => {
          toast.success('Product deleted successfully');
          onOpenChange(false);
        }),
        onError(() => {
          toast.error('Failed to delete product');
        }),
      ],
    }
  );

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete this product?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={(e) => e.preventDefault()}>
            <Button
              className="w-20 text-accent-foreground"
              disabled={isDeleting}
              onClick={() => executeDelete({ id: productId })}
              type="button"
              variant="destructive"
            >
              {isDeleting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
