import { ORPCError } from '@orpc/client';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db';
import { store } from '@/db/schema';
import {
  storeSchema,
  storeWithCategoriesSchema,
} from '@/features/stores/schemas/store-schema';
import { protectedOs, publicOs } from '@/rpc/procedures';

export const storesQueries = {
  protected: {
    getAll: protectedOs.output(storeSchema.array()).handler(async () => {
      const stores = await db.query.store.findMany();
      return stores;
    }),
    getById: protectedOs
      .errors({
        NOT_FOUND: {
          message: 'Store not found',
        },
      })
      .input(z.object({ id: z.string() }))
      .output(storeSchema)
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.id, input.id),
          with: {
            categories: true,
            images: true,
          },
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        return storeFound;
      }),
  },
  public: {
    getBySlug: publicOs
      .errors({
        NOT_FOUND: {
          message: 'Store not found',
        },
      })
      .input(z.object({ slug: z.string() }))
      .output(storeWithCategoriesSchema)
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.slug, input.slug),
          with: {
            categories: true,
            images: true,
          },
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        return storeFound;
      }),
  },
};
