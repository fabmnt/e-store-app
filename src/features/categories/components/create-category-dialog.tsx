'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { skipToken, useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type CategoryCreate,
  categoryCreateSchema,
} from '@/features/categories/schemas/category-schema';
import { client } from '@/lib/orpc';
import { createCategoryAction } from '@/rpc/categories/categories-actions';

export function CreateCategoryDialog() {
  const { storeId } = useParams();
  const { data: store } = useQuery(
    client.stores.protected.getById.queryOptions({
      input: storeId ? { id: storeId as string } : skipToken,
    })
  );

  const { execute, isPending: isCreatingCategory } = useServerAction(
    createCategoryAction,
    {
      interceptors: [
        onSuccess(() => {
          form.reset();
          toast.success('Category created successfully');
          setOpen(false);
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      storeId: store?.id ?? '',
    } as CategoryCreate,
    validators: {
      onSubmit: categoryCreateSchema,
    },
    onSubmit: ({ value }) => {
      // Ensure nullable description is passed as null if empty string
      const payload: CategoryCreate = {
        ...value,
        description: value.description === '' ? null : value.description,
      };
      execute(payload);
    },
  });

  return (
    <Dialog
      onOpenChange={(opened) => {
        if (!opened) {
          form.reset();
        }
        setOpen(opened);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button>Create new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <div>
          <form
            id="create-category-form"
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
                      disabled={isCreatingCategory}
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
                      disabled={isCreatingCategory}
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
                validators={{
                  onChangeAsync: async ({ value }) => {
                    if (!(value && store?.id)) {
                      return;
                    }

                    const isSlugAvailable =
                      await client.categories.protected.isSlugAvailable.call({
                        slug: value,
                        storeId: store.id,
                      });

                    if (!isSlugAvailable) {
                      return 'Slug already exists';
                    }

                    return;
                  },
                }}
              />
              <form.Field
                children={(field) => (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={field.name}>Description</Label>
                    <Input
                      autoComplete="off"
                      disabled={isCreatingCategory}
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={isCreatingCategory}
            form="create-category-form"
            type="submit"
          >
            {isCreatingCategory ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
