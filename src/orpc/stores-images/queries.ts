import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { storeImage } from '@/db/schema';
import { storeImageSchema } from '@/features/stores-images/schemas/store-image-schema';
import { publicOs } from '../procedures';

export const storeImagesQueries = {
  getAllByStoreId: publicOs
    .input(
      z.object({
        storeId: z.uuid(),
      })
    )
    .output(storeImageSchema.array())
    .errors({
      INTERNAL_SERVER_ERROR: {
        message: 'Cannot get store images',
      },
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .handler(async ({ input }) => {
      const storeImages = await db.query.storeImage.findMany({
        where: eq(storeImage.storeId, input.storeId),
      });

      return storeImages;
    }),
};
