import * as z from 'zod';
import { categorySchema } from '@/features/categories/schemas/category-schema';
import { productImageSchema } from '@/features/products-images/schemas/product-images-schema';
import { storeSchema } from '@/features/stores/schemas/store-schema';

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  categoryId: z.uuid('Category is required').nullable(),
  storeId: z.uuid('Store is required'),
  category: categorySchema.nullable(),
  store: storeSchema,
  createdAt: z.coerce.date(),
});

export const productCreateSchema = productSchema.omit({
  id: true,
  createdAt: true,
  category: true,
  store: true,
});

export const productUpdateSchema = productSchema
  .omit({
    createdAt: true,
    storeId: true,
    category: true,
    store: true,
  })
  .partial()
  .extend({
    id: z.string(),
    slug: z.string().optional(),
  });

export const productWithImagesSchema = productSchema.extend({
  images: z.array(productImageSchema),
});

export type ProductWithImages = z.infer<typeof productWithImagesSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
