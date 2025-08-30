import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm, useStore } from '@tanstack/react-form';
import { skipToken, useQuery } from '@tanstack/react-query';
import { Loader, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
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
  type Product,
  type ProductUpdate,
  productUpdateSchema,
  type Tag,
} from '../schemas/product-schema';
import UpdateProductDetails from './update-product-details';
import { UploadProductImages } from './upload-product-images';

type UpdateProductDialogProps = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateProductDialog({
  product,
  open,
  onOpenChange,
}: UpdateProductDialogProps) {
  const [tab, setTab] = useState<'product' | 'images' | 'details'>('product');
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

  const form = useForm({
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      slug: product.slug,
      categoryId: product.categoryId ?? '',
      tags: product.tags ?? [],
    } as ProductUpdate,
    validators: {
      onChange: productUpdateSchema,
    },
    listeners: {
      onChangeDebounceMs: 200,
      onChange: ({ formApi }) => {
        const values = formApi.state.values;
        const { success, data } = productUpdateSchema.safeParse(values);
        if (success) {
          executeUpdate(data);
        }
      },
    },
  });

  const { data: tags } = useQuery(
    client.tags.protected.getAllByStoreId.queryOptions({
      input: storeId ? { storeId: storeId as string } : skipToken,
    })
  );

  const currentTags = useStore(form.store, (state) => state.values.tags);
  const availableTags = useMemo(() => {
    return (
      tags?.filter((tag) => !currentTags?.some((t) => t.id === tag.id)) ?? []
    );
  }, [tags, currentTags]);

  const [seletectedTag, setSeletectedTag] = useState<Tag | null>(null);

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
          onValueChange={(value) =>
            setTab(value as 'product' | 'images' | 'details')
          }
          value={tab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4" value="product">
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
                        value={field.state.value ?? ''}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                  name="slug"
                  validators={{
                    onChangeAsync: async ({ value }) => {
                      if (!value) {
                        return;
                      }

                      const isSlugAvailable =
                        await client.products.protected.isSlugAvailable.call({
                          slug: value,
                          storeId: storeId as string,
                          omitId: product.id,
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
                        disabled={
                          isLoadingCategories || categories?.length === 0
                        }
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

                <form.Field
                  children={(field) => (
                    <div className="col-span-2 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Tags</Label>
                        <div>
                          <div className="flex items-center gap-2">
                            <Select
                              disabled={!availableTags.length}
                              onValueChange={(value) => {
                                setSeletectedTag(
                                  tags?.find((tag) => tag.id === value) ?? null
                                );
                              }}
                              value={seletectedTag?.id ?? ''}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tag" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTags?.map((tag) => (
                                  <SelectItem key={tag.id} value={tag.id}>
                                    {tag.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              disabled={!seletectedTag}
                              onClick={() => {
                                if (seletectedTag) {
                                  field.pushValue(seletectedTag);
                                  setSeletectedTag(null);
                                }
                              }}
                              size="sm"
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.state.value?.map((tag) => (
                          <Button
                            key={tag.id}
                            onClick={() => {
                              const newTags = field.state.value?.filter(
                                (t) => t.id !== tag.id
                              );
                              field.handleChange(newTags);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            {tag.name}
                            <X className="size-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  mode="array"
                  name="tags"
                />
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
                            if (img.fileKey == null) {
                              return;
                            }
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
          <TabsContent className="mt-4" value="details">
            <UpdateProductDetails
              details={product.details ?? []}
              productId={product.id}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <div className="flex items-center justify-center">
            {isUpdating && <Loader className="size-4 animate-spin" />}
          </div>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
