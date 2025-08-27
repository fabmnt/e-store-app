import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { client } from '@/lib/orpc';
import { updateProductAction } from '@/rpc/products/products-actions';
import { deleteProductImage } from '@/rpc/products-images/products-images-actions';
import {
  type ProductUpdate,
  type ProductWithImages,
  productUpdateSchema,
} from '../schemas/product-schema';
import { UploadProductImages } from './upload-product-images';

type UpdateProductDialogProps = {
  product: ProductWithImages;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateProductDialog({
  product,
  open,
  onOpenChange,
}: UpdateProductDialogProps) {
  const [tab, setTab] = useState<'details' | 'images'>('details');
  const { storeId } = useParams();

  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    client.categories.protected.getAllByStoreId.queryOptions({
      input: { storeId: storeId as string },
    })
  );

  const { execute: executeUpdate, isPending: isUpdating } = useServerAction(
    updateProductAction,
    {
      interceptors: [
        onSuccess(() => {
          toast.success('Product updated successfully');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  const { execute: executeDeleteImage, isPending: isDeletingImage } =
    useServerAction(deleteProductImage, {
      interceptors: [
        onSuccess(() => {
          toast.success('Image deleted');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    });

  console.log(product.details);

  const form = useForm({
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      slug: product.slug,
      categoryId: product.categoryId ?? '',
      details: product.details ?? [],
    } as ProductUpdate,
    validators: {
      onSubmit: productUpdateSchema,
    },
    onSubmit: ({ value }) => {
      executeUpdate(value);
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
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <Tabs
          className="w-full"
          onValueChange={(value) => setTab(value as 'details' | 'images')}
          value={tab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4" value="details">
            <form
              id="update-product-form"
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
                        placeholder="shoes-1"
                        value={field.state.value ?? ''}
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
                        disabled={isUpdating}
                        fixedDecimalScale
                        id={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={(value) => {
                          if (value.floatValue !== undefined) {
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
                        disabled={isUpdating}
                        fixedDecimalScale
                        id={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={(value) => {
                          if (value.floatValue !== undefined) {
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
                        disabled={isUpdating || isLoadingCategories}
                        onValueChange={(value) => field.handleChange(value)}
                        value={field.state.value ?? ''}
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
                        disabled={isUpdating}
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
                <form.Field mode="array" name="details">
                  {(field) => (
                    <div className="col-span-2 space-y-2">
                      <div className="flex w-full items-center justify-between gap-2">
                        <Label htmlFor={field.name}>Details</Label>
                      </div>
                      <div className="flex flex-col gap-2">
                        {field.state.value?.map((detail, index) => (
                          <form.Field
                            children={(subField) => (
                              <div className="flex items-center gap-2">
                                <Input
                                  autoComplete="off"
                                  onBlur={subField.handleBlur}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  placeholder="Add a detail for this product"
                                  value={subField.state.value}
                                />
                              </div>
                            )}
                            key={detail.id}
                            name={`details[${index}].content`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
            </form>
          </TabsContent>
          <TabsContent className="mt-4" value="images">
            <div className="space-y-4">
              <UploadProductImages
                productId={product.id}
                storeId={storeId as string}
              />

              {product.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img) => (
                    <div
                      className="group relative overflow-hidden rounded border"
                      key={img.id}
                    >
                      <Image
                        alt="Product"
                        className="h-28 w-full object-cover"
                        height={224}
                        src={img.url}
                        width={400}
                      />
                      <div className="absolute inset-x-0 bottom-0 flex justify-end p-2">
                        <Button
                          disabled={isDeletingImage}
                          onClick={async () => {
                            const idToDelete = img.id;
                            await executeDeleteImage({
                              id: idToDelete,
                              fileKey: img.fileKey,
                              storeId: storeId as string,
                            });
                          }}
                          size="icon"
                          title="Delete image"
                          variant="destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No images yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {tab === 'details' ? 'Cancel' : 'Done'}
            </Button>
          </DialogClose>
          {tab === 'details' && (
            <Button
              className="w-20"
              disabled={isUpdating}
              form="update-product-form"
              type="submit"
            >
              {isUpdating ? <Loader className="size-4 animate-spin" /> : 'Save'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
