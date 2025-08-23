import * as z from 'zod';

export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  storeId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const categoryCreateSchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const categoryUpdateSchema = categorySchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    id: z.uuid(),
  });

export type Category = z.infer<typeof categorySchema>;
export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
