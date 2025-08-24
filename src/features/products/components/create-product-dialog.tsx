'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { skipToken, useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
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
import { createProductAction } from '@/orpc/products/products-actions';
import {
  type Product,
  type ProductCreate,
  productCreateSchema,
} from '../schemas/product-schema';
import { UploadProductImages } from './upload-product-images';

export function CreateProductDialog() {
  const [formStep, setFormStep] = useState<'details' | 'images'>('details');
  const { storeSlug } = useParams();
  const { data: store } = useQuery(
    client.stores.getBySlug.queryOptions({
      input: storeSlug ? { slug: storeSlug as string } : skipToken,
    })
  );
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    client.categories.getAllByStoreSlug.queryOptions({
      input: store?.slug ? { storeSlug: store.slug } : skipToken,
    })
  );
  const { execute, isPending: isCreatingProduct } = useServerAction(
    createProductAction,
    {
      interceptors: [
        onSuccess((data) => {
          form.reset();
          setFormStep('images');
          setCreatedProduct(data);
          toast.success('Product created successfully');
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
      execute(value);
    },
  });

  return (
    <Dialog
      onOpenChange={(opened) => {
        if (!opened) {
          form.reset();
          setCreatedProduct(null);
          setFormStep('details');
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
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <div>
          {formStep === 'details' && (
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
                        disabled={isCreatingProduct}
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
                        disabled={isCreatingProduct}
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
                        disabled={isCreatingProduct}
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
                        disabled={isCreatingProduct}
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
                        disabled={
                          isLoadingCategories ||
                          !categories?.length ||
                          isCreatingProduct
                        }
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
                        disabled={isCreatingProduct}
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
          )}
          {formStep === 'images' && createdProduct && store?.slug && (
            <div>
              <UploadProductImages
                productId={createdProduct.id}
                storeSlug={store.slug}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {formStep === 'details' ? 'Cancel' : 'Done'}
            </Button>
          </DialogClose>
          {formStep === 'details' && (
            <Button
              className="w-20"
              disabled={isCreatingProduct}
              form="create-product-form"
              type="submit"
            >
              {isCreatingProduct ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                'Create'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
