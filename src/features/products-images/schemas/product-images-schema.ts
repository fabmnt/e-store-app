import * as z from 'zod';

export const productImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  createdAt: z.coerce.date(),
  productId: z.uuid(),
});

export const createProductImageSchema = productImageSchema.omit({
  id: true,
  createdAt: true,
});

export type ProductImage = z.infer<typeof productImageSchema>;
export type CreateProductImage = z.infer<typeof createProductImageSchema>;
