import * as z from 'zod';

export const storeImageSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  fileKey: z.string(),
  createdAt: z.coerce.date(),
  storeId: z.uuid().nullable(),
});

export type StoreImage = z.infer<typeof storeImageSchema>;
