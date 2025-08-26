import * as z from 'zod';
import { categorySchema } from '@/features/categories/schemas/category-schema';
import { storeImageSchema } from '@/features/stores-images/schemas/store-image-schema';

export const storeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Store name is required'),
  slug: z.string().min(1, 'Store slug is required'),
  description: z.string().nullable(),
  imageURL: z.url().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  email: z.email().nullable(),
  website: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const storeWithCategoriesSchema = storeSchema.extend({
  categories: z.array(categorySchema),
  images: z.array(storeImageSchema),
});

export type StoreWithCategories = z.infer<typeof storeWithCategoriesSchema>;

export const createStoreSchema = storeSchema.omit({
  id: true,
  createdAt: true,
});

export const updateStoreSchema = storeSchema
  .omit({
    createdAt: true,
    imageURL: true,
    website: true,
  })
  .partial()
  .extend({
    id: z.uuid(),
  });

export type Store = z.infer<typeof storeSchema>;
export type CreateStore = z.infer<typeof createStoreSchema>;
export type UpdateStore = z.infer<typeof updateStoreSchema>;
