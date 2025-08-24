'use client';

import { onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { FieldInfo } from '@/components/field-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateStoreAction } from '@/orpc/stores/stores-actions';
import {
  type Store,
  type UpdateStore,
  updateStoreSchema,
} from '../schemas/store-schema';

type UpdateStoreFormProps = {
  store: Store;
};

export function UpdateStoreForm({ store }: UpdateStoreFormProps) {
  const { execute: executeStoreUpdate, isPending: isUpdatingStore } =
    useServerAction(updateStoreAction, {
      interceptors: [
        onSuccess(() => {
          form.reset();
          toast.success('Store updated successfully');
        }),
      ],
    });

  const form = useForm({
    defaultValues: {
      name: store.name,
      slug: store.slug,
      description: store.description,
      address: store.address,
      phone: store.phone,
      whatsapp: store.whatsapp,
      email: store.email,
      facebook: store.facebook,
      instagram: store.instagram,
      id: store.id,
    } as UpdateStore,
    validators: {
      onSubmit: updateStoreSchema,
    },
    onSubmit: ({ value }) => {
      executeStoreUpdate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
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
                disabled={isUpdatingStore}
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
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="my-store"
                value={field.state.value ?? ''}
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
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="A brief description of your store..."
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="description"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Address</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="123 Main St, City, State"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="address"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Phone</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="phone"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>WhatsApp</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="whatsapp"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="contact@store.com"
                type="email"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="email"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Facebook</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://facebook.com/store"
                type="url"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="facebook"
        />

        <form.Field
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Instagram</Label>
              <Input
                autoComplete="off"
                disabled={isUpdatingStore}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://instagram.com/store"
                type="url"
                value={field.state.value ?? ''}
              />
              <FieldInfo field={field} />
            </div>
          )}
          name="instagram"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="w-24" disabled={isUpdatingStore} type="submit">
          {isUpdatingStore ? <Loader className="animate-spin" /> : 'Update'}
        </Button>
      </div>
    </form>
  );
}
