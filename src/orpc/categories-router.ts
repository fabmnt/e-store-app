import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { category, store } from '@/db/schema';
import { categorySchema } from '@/features/categories/schemas/category-schema';
import { protectedOs } from './procedures';

export const categoriesRouter = {
  getAllByStoreSlug: protectedOs
    .input(z.object({ storeSlug: z.string() }))
    .output(categorySchema.array())
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

      const categoriesFound = await db.query.category.findMany({
        where: eq(category.storeId, storeFound.id),
      });

      return categoriesFound;
    }),
};
