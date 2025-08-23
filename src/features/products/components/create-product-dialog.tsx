'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { client } from '@/lib/orpc';
import {
  type ProductCreate,
  productCreateSchema,
} from '../schemas/product-schema';

export function CreateProductDialog() {
  const { storeSlug } = useParams();
  const queryClient = useQueryClient();
  const { data: store } = useQuery(
    client.stores.getBySlug.queryOptions({
      enabled: !!storeSlug,
      input: { slug: storeSlug as string },
    })
  );
  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    client.categories.getAllByStoreSlug.queryOptions({
      enabled: !!store,
      input: { storeSlug: store?.slug ?? '' },
    })
  );
  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation(
    client.products.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: client.products.getAllByStoreSlug.key(),
        });
      },
    })
  );
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      slug: '',
      categoryId: '',
      storeId: store?.id ?? '',
    } as ProductCreate,
    validators: {
      onSubmit: productCreateSchema,
    },
    onSubmit: ({ value }) => {
      createProduct(value, {
        onSuccess: () => {
          form.reset();
          toast.success('Product created successfully');
          setOpen(false);
        },
      });
    },
  });

  const errors = useStore(form.store, (state) => state.errors);

  console.log(errors);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Create new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <div>
          <form
            id="create-product-form"
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
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="shoes-1"
                      value={field.state.value}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
                name="slug"
              />
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Price</Label>
                    <NumericFormat
                      allowNegative={false}
                      customInput={Input}
                      decimalScale={2}
                      fixedDecimalScale
                      id={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        if (value.floatValue) {
                          field.handleChange(value.floatValue);
                        }
                      }}
                      placeholder="100.00"
                      value={field.state.value}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
                name="price"
              />
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Stock</Label>
                    <NumericFormat
                      allowNegative={false}
                      customInput={Input}
                      decimalScale={0}
                      fixedDecimalScale
                      id={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        if (value.floatValue) {
                          field.handleChange(value.floatValue);
                        }
                      }}
                      placeholder="100"
                      value={field.state.value}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
                name="stock"
              />
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Category</Label>
                    <Select
                      disabled={isLoadingCategories || !categories?.length}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      value={field.state.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </div>
                )}
                name="categoryId"
              />
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Description</Label>
                    <Input
                      autoComplete="off"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Shoes..."
                      value={field.state.value ?? ''}
                    />
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
            disabled={isCreatingProduct}
            form="create-product-form"
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
