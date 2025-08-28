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
import type { Tag } from '@/features/products/schemas/product-schema';
import { deleteTagAction } from '@/rpc/tags/tags-actions';

type DeleteTagDialogProps = {
  tag: Tag;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteTagDialog({
  tag,
  onOpenChange,
  open,
}: DeleteTagDialogProps) {
  const { execute: executeDelete, isPending: isDeleting } = useServerAction(
    deleteTagAction,
    {
      interceptors: [
        onSuccess(() => {
          toast.success('Tag deleted successfully');
          onOpenChange(false);
        }),
        onError(() => {
          toast.error('Failed to delete tag');
        }),
      ],
    }
  );
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tag?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={(e) => {
              e.preventDefault();
              executeDelete({ id: tag.id, storeId: tag.storeId });
            }}
          >
            <Button
              className="w-20 text-accent-foreground"
              disabled={isDeleting}
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
