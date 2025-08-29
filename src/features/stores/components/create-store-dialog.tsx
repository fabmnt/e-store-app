'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { Loader } from 'lucide-react';
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
  type CreateStore,
  createStoreSchema,
} from '@/features/stores/schemas/store-schema';
import { createStoreAction } from '@/rpc/stores/stores-actions';

export function CreateStoreDialog() {
  const { execute, isPending: isCreatingStore } = useServerAction(
    createStoreAction,
    {
      interceptors: [
        onSuccess(() => {
          form.reset();
          toast.success('Store created successfully');
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
      imageURL: null,
      address: null,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      facebook: null,
      instagram: null,
    } as unknown as CreateStore,
    validators: {
      onSubmit: createStoreSchema,
    },
    onSubmit: ({ value }) => {
      const payload: CreateStore = {
        ...value,
        description: value.description === '' ? null : value.description,
      } as CreateStore;
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
          <DialogTitle>Create Store</DialogTitle>
        </DialogHeader>
        <div>
          <form
            id="create-store-form"
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
                      disabled={isCreatingStore}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="My Store"
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
                      disabled={isCreatingStore}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="my-store"
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
                      disabled={isCreatingStore}
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
            disabled={isCreatingStore}
            form="create-store-form"
            type="submit"
          >
            {isCreatingStore ? (
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
