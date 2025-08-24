import { ORPCError } from '@orpc/client';
import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product, store } from '@/db/schema';
import { productWithImagesSchema } from '@/features/products/schemas/product-schema';
import { protectedOs } from './procedures';

export const productsRouter = {
  getAllByStoreSlug: protectedOs
    .input(
      z.object({
        storeSlug: z.string(),
      })
    )
    .output(z.array(productWithImagesSchema))
    .errors({
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .handler(async ({ input }) => {
      const storeFound = await db.query.store.findFirst({
        where: eq(store.slug, input.storeSlug),
      });

      if (!storeFound) {
        throw new ORPCError('NOT_FOUND');
      }

      const productsFound = await db.query.product.findMany({
        where: eq(product.storeId, storeFound.id),
        orderBy: [desc(product.createdAt)],
        with: {
          category: true,
          store: true,
          images: true,
        },
      });

      return productsFound;
    }),
};
