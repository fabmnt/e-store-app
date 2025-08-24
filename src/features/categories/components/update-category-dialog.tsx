import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { FieldInfo } from '@/components/field-info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Category,
  type CategoryUpdate,
  categoryUpdateSchema,
} from '@/features/categories/schemas/category-schema';
import { updateCategoryAction } from '@/orpc/categories/categories-actions';

type UpdateCategoryDialogProps = {
  category: Category;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function UpdateCategoryDialog({
  category,
  open,
  onOpenChange,
}: UpdateCategoryDialogProps) {
  const { execute: executeUpdate, isPending: isUpdating } = useServerAction(
    updateCategoryAction,
    {
      interceptors: [
        onSuccess(() => {
          toast.success('Category updated successfully');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  const form = useForm({
    defaultValues: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      storeId: category.storeId,
    } as unknown as CategoryUpdate,
    validators: {
      onSubmit: categoryUpdateSchema,
    },
    onSubmit: ({ value }) => {
      const payload: CategoryUpdate = {
        ...value,
        // Submit nullable description as null when empty
        description:
          typeof value.description === 'string' &&
          value.description.trim() === ''
            ? (null as unknown as string | null)
            : (value.description as unknown as string | null),
      } as CategoryUpdate;
      executeUpdate(payload);
    },
  });

  return (
    <Dialog
      onOpenChange={(opened) => {
        if (!opened) {
          form.reset();
        }
        onOpenChange?.(opened);
      }}
      open={open ?? false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
        </DialogHeader>
        <form
          id="update-category-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    autoComplete="off"
                    disabled={isUpdating}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Shoes..."
                    value={field.state.value}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
              name="name"
            />

            <form.Field
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Slug</Label>
                  <Input
                    autoComplete="off"
                    disabled={isUpdating}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="shoes-category"
                    value={field.state.value}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
              name="slug"
            />

            <form.Field
              children={(field) => (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor={field.name}>Description</Label>
                  <Input
                    autoComplete="off"
                    disabled={isUpdating}
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Optional description..."
                    value={field.state.value ?? ''}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
              name="description"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={isUpdating}
            form="update-category-form"
            type="submit"
          >
            {isUpdating ? <Loader className="size-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
