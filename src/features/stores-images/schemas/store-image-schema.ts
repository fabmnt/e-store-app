import * as z from 'zod';

export const storeImageTypeSchema = z.enum(['cover', 'logo', 'banner']);

export type StoreImageType = z.infer<typeof storeImageTypeSchema>;

export const storeImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  fileKey: z.string(),
  type: storeImageTypeSchema.nullable(),
  createdAt: z.coerce.date(),
  storeId: z.uuid().nullable(),
});

export type StoreImage = z.infer<typeof storeImageSchema>;
