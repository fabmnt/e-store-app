import { ORPCError } from '@orpc/client';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product, store } from '@/db/schema';
import { productSchema } from '@/features/products/schemas/product-schema';
import { protectedOs } from './procedures';

export const productsRouter = {
  getAllByStoreSlug: protectedOs
    .input(
      z.object({
        storeSlug: z.string(),
      })
    )
    .output(z.array(productSchema))
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
      });

      return productsFound;
    }),
};
