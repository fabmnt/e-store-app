import { ORPCError } from '@orpc/client';
import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product, store } from '@/db/schema';
import {
  productCreateSchema,
  productSchema,
} from '@/features/products/schemas/product-schema';
import { protectedOs } from './procedures';

export const productsRouter = {
  create: protectedOs
    .input(productCreateSchema)
    .output(productSchema)
    .errors({
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .handler(async ({ input }) => {
      const storeFound = await db.query.store.findFirst({
        where: eq(store.id, input.storeId),
      });
      if (!storeFound) {
        throw new ORPCError('NOT_FOUND');
      }

      const [productCreated] = await db
        .insert(product)
        .values(input)
        .returning();

      if (!productCreated) {
        throw new ORPCError('INTERNAL_SERVER_ERROR');
      }

      return productCreated;
    }),
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
        orderBy: [desc(product.createdAt)],
      });

      return productsFound;
    }),
};
