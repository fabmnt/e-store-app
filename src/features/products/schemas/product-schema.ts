import * as z from 'zod';
import { categorySchema } from '@/features/categories/schemas/category-schema';
import { productImageSchema } from '@/features/products-images/schemas/product-images-schema';
import { storeSchema } from '@/features/stores/schemas/store-schema';

export const productDetailSchema = z.object({
  id: z.uuid(),
  content: z.string().min(1, 'Content is required'),
  productId: z.uuid('Product is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable(),
  price: z.number().min(0, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock must be greater than 0'),
  categoryId: z.uuid('Category is required').nullable(),
  storeId: z.uuid('Store is required'),
  category: categorySchema.nullable(),
  store: storeSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const productWithDetailsSchema = productSchema.extend({
  details: z.array(productDetailSchema).optional(),
  images: z.array(productImageSchema),
});

export const productDetailCreateSchema = productDetailSchema.omit({
  createdAt: true,
  updatedAt: true,
  productId: true,
});

export const productCreateSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    category: true,
    store: true,
  })
  .extend({
    details: z.array(productDetailCreateSchema).default([]).optional(),
  });

export const productUpdateSchema = productSchema
  .omit({
    createdAt: true,
    storeId: true,
    category: true,
    store: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    id: z.string(),
  });

export const productWithImagesSchema = productSchema.extend({
  images: z.array(productImageSchema),
});

export type ProductWithDetails = z.infer<typeof productWithDetailsSchema>;
export type ProductWithImages = z.infer<typeof productWithImagesSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
