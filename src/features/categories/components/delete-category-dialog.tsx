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
import { deleteCategoryAction } from '@/rpc/categories/categories-actions';
import type { Category } from '../schemas/category-schema';

type DeleteCategoryDialogProps = {
  category: Category;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteCategoryDialog({
  category,
  onOpenChange,
  open,
}: DeleteCategoryDialogProps) {
  const { execute: executeDelete, isPending: isDeleting } = useServerAction(
    deleteCategoryAction,
    {
      interceptors: [
        onSuccess(() => {
          toast.success('Category deleted successfully');
          onOpenChange(false);
        }),
        onError(() => {
          toast.error('Failed to delete category');
        }),
      ],
    }
  );
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            <span>Are you sure you want to delete this category?</span>
            <br />
            <span>
              The products of this category will be tagged as "Uncategorized".
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={(e) => {
              e.preventDefault();
              executeDelete({ id: category.id, storeId: category.storeId });
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
