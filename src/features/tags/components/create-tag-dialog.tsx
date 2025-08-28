'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { skipToken, useQuery } from '@tanstack/react-query';
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
  type TagCreate,
  tagCreateSchema,
} from '@/features/products/schemas/product-schema';
import { client } from '@/lib/orpc';
import { createTagAction } from '@/rpc/tags/tags-actions';

export function CreateTagDialog() {
  const { storeId } = useParams();
  const { data: store } = useQuery(
    client.stores.protected.getById.queryOptions({
      input: storeId ? { id: storeId as string } : skipToken,
    })
  );

  const { execute, isPending } = useServerAction(createTagAction, {
    interceptors: [
      onSuccess(() => {
        form.reset();
        toast.success('Tag created successfully');
        setOpen(false);
      }),
      onError((error) => toast.error(error.message)),
    ],
  });

  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      storeId: store?.id ?? '',
    } as TagCreate,
    validators: { onSubmit: tagCreateSchema },
    onSubmit: ({ value }) => {
      const payload: TagCreate = {
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
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <div>
          <form
            id="create-tag-form"
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
                      disabled={isPending}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Summer"
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
                      disabled={isPending}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="summer"
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
                      disabled={isPending}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
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
            disabled={isPending}
            form="create-tag-form"
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
