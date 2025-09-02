import { ORPCError } from '@orpc/server';
import { asc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { store, storeImage } from '@/db/schema';
import { storeSchema } from '@/features/stores/schemas/store-schema';
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
        orderBy: [asc(storeImage.createdAt)],
      });

      return storeImages;
    }),
  getStoreLogo: publicOs
    .input(z.object({ storeSlug: z.string() }))
    .output(
      z.object({ storeLogo: storeImageSchema, store: storeSchema }).optional()
    )
    .handler(async ({ input }) => {
      const storeFound = await db.query.store.findFirst({
        where: eq(store.slug, input.storeSlug),
        with: {
          images: true,
        },
      });

      if (!storeFound) {
        throw new ORPCError('NOT_FOUND');
      }

      const storeLogo = storeFound.images.find(
        (image) => image.type === 'logo'
      );

      if (!storeLogo) {
        return;
      }

      return { storeLogo, store: storeFound };
    }),
};
