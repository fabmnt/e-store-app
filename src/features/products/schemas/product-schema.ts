import * as z from 'zod';

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number().positive(),
  stock: z.number().positive(),
  categoryId: z.uuid(),
  storeId: z.uuid(),
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

export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
