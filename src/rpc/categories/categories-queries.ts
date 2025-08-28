import { ORPCError } from '@orpc/server';
import { and, eq, not } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { category, store } from '@/db/schema';
import { categorySchema } from '@/features/categories/schemas/category-schema';
import { protectedOs, publicOs } from '@/rpc/procedures';

export const categoriesQueries = {
  public: {
    getAllByStoreId: publicOs
      .input(z.object({ storeId: z.string() }))
      .output(categorySchema.array())
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

        const categoriesFound = await db.query.category.findMany({
          where: eq(category.storeId, storeFound.id),
        });

        return categoriesFound;
      }),
  },
  protected: {
    getAllByStoreId: protectedOs
      .input(z.object({ storeId: z.string() }))
      .output(categorySchema.array())
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

        const categoriesFound = await db.query.category.findMany({
          where: eq(category.storeId, storeFound.id),
        });

        return categoriesFound;
      }),
    isSlugAvailable: protectedOs
      .input(
        z.object({
          slug: z.string(),
          storeId: z.uuid(),
          omitId: z.string().optional(),
        })
      )
      .output(z.boolean())
      .handler(async ({ input }) => {
        if (input.omitId) {
          const categoryFound = await db.query.category.findFirst({
            where: and(
              eq(category.slug, input.slug),
              eq(category.storeId, input.storeId),
              not(eq(category.id, input.omitId))
            ),
          });

          return !categoryFound;
        }

        const categoryFound = await db.query.category.findFirst({
          where: and(
            eq(category.slug, input.slug),
            eq(category.storeId, input.storeId)
          ),
        });

        return !categoryFound;
      }),
  },
};
