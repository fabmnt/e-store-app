import * as z from 'zod';
import { productImageSchema } from '@/features/products-images/schemas/product-images-schema';

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  categoryId: z.uuid('Category is required'),
  storeId: z.uuid('Store is required'),
  createdAt: z.coerce.date(),
});

export const productCreateSchema = productSchema.omit({
  id: true,
  createdAt: true,
});

export const productUpdateSchema = productSchema
  .omit({
    createdAt: true,
    storeId: true,
    categoryId: true,
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
